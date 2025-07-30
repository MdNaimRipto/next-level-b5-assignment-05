import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../util/catchAsync";
import sendResponse from "../../../util/sendResponse";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";
import { RidesService } from "./rides.service";

// User Register
const getAllActiveRides = catchAsync(async (req: Request, res: Response) => {
  const result = await RidesService.getAllActiveRides();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active Drives Retrieved",
    data: result,
  });
});

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);

  const { ...payload } = req.body;

  const result = await RidesService.requestRide(token, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ride Requested Successfully",
    data: result,
  });
});

const updateRide = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const { id } = req.params;
  const { ...payload } = req.body;

  const result = await RidesService.updateRide(token, id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ride Updated Successfully",
    data: result,
  });
});

const viewEarningHistory = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const { id } = req.params;

  const result = await RidesService.viewEarningHistory(token, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Earning History Retrieved",
    data: result,
  });
});

export const RidesController = {
  getAllActiveRides,
  requestRide,
  updateRide,
  viewEarningHistory,
};
