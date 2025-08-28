import { Request, Response } from "express";
import { UserService } from "./users.service";
import httpStatus from "http-status";
import catchAsync from "../../../util/catchAsync";
import sendResponse from "../../../util/sendResponse";
import { jwtHelpers, setAuthCookie } from "../../../util/jwt/jwt.utils";

// User Register
const userRegister = catchAsync(async (req: Request, res: Response) => {
  const { ...userInfo } = req.body;

  const result = await UserService.userRegister(userInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Registration Successful",
    data: result,
  });
});

// Verify Account
const verifyAccount = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  const result = await UserService.verifyAccount(token as string);

  setAuthCookie(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Verification Successful",
    data: null,
  });
});

// User Login
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...authCredentials } = req.body;

  const result = await UserService.userLogin(authCredentials);

  setAuthCookie(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login Successful",
    data: null,
  });
});

// Get User
const getAuthenticatedUserDetails = catchAsync(
  async (req: Request, res: Response) => {
    const token = jwtHelpers.verifyAuthToken(req);

    const result = await UserService.getAuthenticatedUserDetails(token);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Details Retrieved Successfully",
      data: result,
    });
  }
);

// Logout
const logout = catchAsync(async (req: Request, res: Response) => {
  await UserService.logout(res);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const tokenInfo = await UserService.getNewAccessToken(refreshToken as string);

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New Access Token Retrived Successfully",
    data: tokenInfo,
  });
});

// Update User
const updatedUser = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await UserService.updateUser(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Updated Successfully",
    data: result,
  });
});

// Update User
const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await UserService.updatePassword(payload, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Updated Successfully",
    data: result,
  });
});

// Update Active Status
const updateActiveStatus = catchAsync(async (req: Request, res: Response) => {
  const { ...payload } = req.body;
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await UserService.updateActiveStatus(token, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active Status Updated Successfully",
    data: result,
  });
});

export const UserController = {
  userRegister,
  verifyAccount,
  userLogin,
  getAuthenticatedUserDetails,
  logout,
  getNewAccessToken,
  updatedUser,
  updatePassword,
  updateActiveStatus,
};
