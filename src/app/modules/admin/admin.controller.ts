import { Request, Response } from "express";
import catchAsync from "../../../util/catchAsync";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";
import { AdminService } from "./admin.service";
import sendResponse from "../../../util/sendResponse";
import httpStatus from "http-status";
import { userRoleEnums } from "../users/users.interface";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const { role } = req.query;

  const result = await AdminService.getAllUsers(token, role as userRoleEnums);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved",
    data: result,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);

  const result = await AdminService.getAllRides(token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rides Retrieved",
    data: result,
  });
});

const changeUserApproveStatus = catchAsync(
  async (req: Request, res: Response) => {
    const token = jwtHelpers.verifyAuthToken(req);
    const { id } = req.params;

    const result = await AdminService.changeUserApproveStatus(token, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Updated Approve Status",
      data: result,
    });
  }
);

const changeUserBlockStatus = catchAsync(
  async (req: Request, res: Response) => {
    const token = jwtHelpers.verifyAuthToken(req);
    const { id } = req.params;

    const result = await AdminService.changeUserBlockStatus(token, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Updated Blocked Status",
      data: result,
    });
  }
);

export const AdminController = {
  getAllUsers,
  getAllRides,
  changeUserApproveStatus,
  changeUserBlockStatus,
};
