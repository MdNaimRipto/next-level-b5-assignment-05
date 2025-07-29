import httpStatus from "http-status";
import {
  IAuthenticatedUser,
  ILoginUser,
  IUpdatePassword,
  IUser,
  IVerifyAccount,
} from "./users.interface";
import { Users } from "./users.schema";
import ApiError from "../../../errors/ApiError";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { envConfig } from "../../../config/config";
import { verifyEmailTemplate } from "../../../util/templates/verifyEmailTemplate";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";
import { Secret } from "jsonwebtoken";

//* User Register
const userRegister = async (payload: IUser): Promise<null> => {
  const { email, contactNumber, role } = payload;

  const lowercaseEmail = email.toLocaleLowerCase();

  const isExistsUser = await Users.findOne({
    $or: [{ email: lowercaseEmail }, { contactNumber }],
  });

  if (isExistsUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Email or Contact Number Already Exists"
    );
  }

  if (role === "admin") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Need authorization to become admin"
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    envConfig.salt_round
  );

  const createdUser = await Users.create({
    ...payload,
    email: lowercaseEmail,
    password: hashedPassword,
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: envConfig.nodemailer_user,
      pass: envConfig.nodemailer_pass,
    },
  });

  const verificationLink = `https://your-frontend.com/auth/verify?email=${email}&num=${createdUser.contactNumber}`;
  const htmlContent = verifyEmailTemplate(
    verificationLink,
    createdUser.userName
  );

  await transporter.sendMail({
    to: email,
    subject: "Account Verification Mail",
    html: htmlContent,
  });

  return null;
};

// * Verify Account
const verifyAccount = async (payload: IVerifyAccount): Promise<null> => {
  const { email, contactNumber } = payload;

  const lowercaseEmail = email.toLocaleLowerCase();

  const isExistsUser = await Users.findOne({
    $and: [{ email: lowercaseEmail }, { contactNumber }],
  });

  if (isExistsUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Email or Contact Number Not found"
    );
  }

  await Users.findOneAndUpdate(
    {
      $and: [{ email: lowercaseEmail }, { contactNumber }],
    },
    {
      isActive: "active",
      isApproved: true,
      isVerified: true,
    }
  );

  return null;
};

//* User Login
const userLogin = async (payload: ILoginUser): Promise<IAuthenticatedUser> => {
  const { email, password } = payload;

  const isExists = await Users.findOne({ email: email });

  if (!isExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  const checkPassword = await bcrypt.compare(password, isExists.password);

  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  const jwtPayload = {
    email: isExists.email,
    id: isExists._id,
    role: isExists.role,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    envConfig.jwt_access_secret,
    envConfig.jwt_access_expires_in
  );

  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    envConfig.jwt_refresh_secret,
    envConfig.jwt_refresh_expires_in
  );

  const userData = isExists.toObject() as any;
  delete userData.password;

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

//* Update User
const updateUser = async (
  userID: string,
  payload: Partial<IUser>,
  token: string
): Promise<null> => {
  jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret as Secret);

  const isExistsUser = await Users.findById({ _id: userID });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const { role, password, location, ...updatePayload } = payload;

  if (role !== undefined || password !== undefined) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Permission Denied! Please Try Again."
    );
  }

  if (payload.email) {
    const isExists = await Users.findOne({ email: payload.email });
    if (isExists) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Email Already Exists! Try Another One."
      );
    }
    updatePayload.email = payload.email;
  }

  if (payload.contactNumber) {
    const isExists = await Users.findOne({
      contactNumber: payload.contactNumber,
    });
    if (isExists) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Contact Number Already Exists! Try Another One."
      );
    }
    updatePayload.contactNumber = payload.contactNumber;
  }

  if (location && Object.keys(location).length > 0) {
    Object.keys(location).map((key) => {
      const locationsKey = `location.${key}`;
      (updatePayload as any)[locationsKey] =
        location[key as keyof typeof location];
    });
  }

  await Users.findOneAndUpdate({ _id: userID }, updatePayload, {
    new: true,
  });

  return null;
};

// * For Updating the password
const updatePassword = async (
  payload: IUpdatePassword,
  token: string
): Promise<null> => {
  jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret as Secret);

  const { userId, currentPassword, newPassword, confirmPassword } = payload;

  const isExistsUser = await Users.findById({ _id: userId });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const isPassMatched = await bcrypt.compare(
    currentPassword,
    isExistsUser.password as string
  );

  if (!isPassMatched) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect current password. Please try again."
    );
  }

  const isPreviousPass = await bcrypt.compare(
    newPassword,
    isExistsUser.password as string
  );

  if (isPreviousPass || currentPassword === newPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password Cannot be The Previous Password"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password and Confirm Password must match."
    );
  }

  const pass = await bcrypt.hash(newPassword, Number(envConfig.salt_round));
  isExistsUser.password = pass;

  const user = await Users.findOneAndUpdate({ _id: userId }, isExistsUser, {
    new: true,
  });

  return null;
};

export const UserService = {
  userRegister,
  verifyAccount,
  userLogin,
  updateUser,
  updatePassword,
};
