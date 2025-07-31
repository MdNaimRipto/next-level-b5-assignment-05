import { Request, Response } from "express";
import { UserService } from "./users.service";
import httpStatus from "http-status";
import catchAsync from "../../../util/catchAsync";
import sendResponse from "../../../util/sendResponse";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";

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
  const { ...payload } = req.body;

  const result = await UserService.verifyAccount(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Verification Successful",
    data: result,
  });
});

// User Login
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...authCredentials } = req.body;

  const result = await UserService.userLogin(authCredentials);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login Successful",
    data: result,
  });
});

// Update User
const updatedUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...payload } = req.body;
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await UserService.updateUser(id, payload, token);

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
  updatedUser,
  updatePassword,
  updateActiveStatus,
};
