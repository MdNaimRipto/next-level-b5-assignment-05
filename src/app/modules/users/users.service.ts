import httpStatus from "http-status";
import {
  IAuthenticatedUser,
  ILoginUser,
  isActiveEnums,
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
import { Response } from "express";
import { createNewAccessTokenWithRefreshToken } from "./user.utils";

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
    Number(envConfig.salt_round)
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

  const jwtPayload = {
    email: createdUser.email,
    id: createdUser._id,
    role: createdUser.role,
  };

  const token = jwtHelpers.createToken(
    jwtPayload,
    envConfig.jwt_access_secret,
    envConfig.jwt_access_expires_in
  );

  const verificationLink = `${envConfig.FRONTEND_URL}/auth/verify?token=${token}`;
  const htmlContent = verifyEmailTemplate(
    createdUser.userName,
    verificationLink
  );

  await transporter.sendMail({
    to: email,
    subject: "Account Verification Mail",
    html: htmlContent,
  });

  return null;
};

// * Verify Account
const verifyAccount = async (token: string): Promise<IAuthenticatedUser> => {
  const { id, email } = jwtHelpers.jwtVerify(
    token,
    envConfig.jwt_access_secret
  );

  const lowercaseEmail = email.toLocaleLowerCase();

  const isExistsUser = await Users.findOne({
    $and: [{ email: lowercaseEmail }, { _id: id }],
  });

  if (!isExistsUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Email or Contact Number Not found"
    );
  }

  if (isExistsUser.isVerified === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Account already verified");
  }

  await Users.findOneAndUpdate(
    {
      $and: [{ email: lowercaseEmail }, { _id: id }],
    },
    {
      isActive: "active",
      isApproved: true,
      isVerified: true,
    }
  );

  const jwtPayload = {
    email: isExistsUser.email,
    id: isExistsUser._id,
    role: isExistsUser.role,
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

  return {
    accessToken,
    refreshToken,
  };
};

//* User Login
const userLogin = async (payload: ILoginUser): Promise<IAuthenticatedUser> => {
  const { email, password } = payload;

  const isExists = await Users.findOne({ email: email });

  if (!isExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  const { isVerified, isBlocked, isApproved } = isExists;

  if (isBlocked) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "This account has been blocked by ADMIN and cannot be used anymore"
    );
  }

  if (!isVerified) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Your account is not verified yet. Please check email and verify your account"
    );
  }

  if (!isApproved) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Your account has been suspended by the admin. Contact support for more info"
    );
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

  return {
    accessToken,
    refreshToken,
  };
};

const getAuthenticatedUserDetails = async (
  accessToken: string
): Promise<IUser | null> => {
  const { id, email } = jwtHelpers.jwtVerify(
    accessToken,
    envConfig.jwt_access_secret
  );
  const result = await Users.findOne({
    _id: id,
    email: email.toLocaleUpperCase(),
  }).select("-password");
  return result;
};

const logout = async (res: Response): Promise<null> => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return null;
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

//* Update User
const updateUser = async (
  payload: Partial<IUser>,
  token: string
): Promise<null> => {
  const { id } = jwtHelpers.jwtVerify(
    token,
    envConfig.jwt_access_secret as Secret
  );

  const isExistsUser = await Users.findById({ _id: id });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const {
    isBlocked,
    isVerified,
    isApproved,
    isActive,
    role,
    password,
    vehicle,
    ...updatePayload
  } = payload;

  if (
    role !== undefined ||
    password !== undefined ||
    isBlocked !== undefined ||
    isActive !== undefined ||
    isVerified !== undefined ||
    isApproved !== undefined
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Permission Denied! Please Try Again."
    );
  }

  if (payload.email) {
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Please provide a valid email address"
      );
    }

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
    if (!/^01[3-9]\d{8}$/.test(payload.contactNumber)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Please provide a valid Bangladeshi phone number"
      );
    }

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

  // ✅ vehicle update logic
  if (vehicle !== undefined) {
    if (isExistsUser.role !== "driver") {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Only drivers can update vehicle details"
      );
    }

    if (vehicle && Object.keys(vehicle).length > 0) {
      Object.keys(vehicle).map((key) => {
        const locationsKey = `vehicle.${key}`;
        (updatePayload as any)[locationsKey] =
          vehicle[key as keyof typeof vehicle];
      });
    }
  }

  await Users.findOneAndUpdate({ _id: id }, updatePayload, {
    new: true,
  });

  return null;
};

// * For Updating the password
const updatePassword = async (
  payload: IUpdatePassword,
  token: string
): Promise<null> => {
  const { id } = jwtHelpers.jwtVerify(
    token,
    envConfig.jwt_access_secret as Secret
  );

  const { currentPassword, newPassword, confirmPassword } = payload;

  const isExistsUser = await Users.findById({ _id: id });
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

  const user = await Users.findOneAndUpdate({ _id: id }, isExistsUser, {
    new: true,
  });

  return null;
};

// * Update Active status
const updateActiveStatus = async (
  token: string,
  payload: {
    isActive: isActiveEnums;
  }
): Promise<null> => {
  const { email, id } = jwtHelpers.jwtVerify(
    token,
    envConfig.jwt_access_secret
  );

  const { isActive } = payload;

  const isExistsUser = await Users.findOne({ $and: [{ email }, { _id: id }] });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  await Users.findOneAndUpdate(
    { $and: [{ email }, { _id: id }] },
    {
      isActive: isActive,
    }
  );

  return null;
};

export const UserService = {
  userRegister,
  verifyAccount,
  userLogin,
  getAuthenticatedUserDetails,
  logout,
  getNewAccessToken,
  updateUser,
  updatePassword,
  updateActiveStatus,
};
