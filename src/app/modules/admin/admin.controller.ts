import { Request, Response } from "express";
import catchAsync from "../../../util/catchAsync";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";
import { AdminService } from "./admin.service";
import sendResponse from "../../../util/sendResponse";
import httpStatus from "http-status";
import { userRoleEnums } from "../users/users.interface";
import { UserFilterableFields } from "../users/user.constant";
import { paginationFields } from "../../../util/pagination/pagination.constant";
import { pick } from "../../../util/pagination/pagination.utils";
import { EarningFilter } from "../rides/rides.interface";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const filters = pick(req.query, UserFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await AdminService.getAllUsers(token, filters, options);

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

const viewAnalytics = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const filter = req.query.filter as unknown as EarningFilter;

  const result = await AdminService.viewAnalytics(token, filter);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Analytics Status",
    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  getAllRides,
  changeUserApproveStatus,
  changeUserBlockStatus,
  viewAnalytics,
};
