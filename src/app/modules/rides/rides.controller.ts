import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../util/catchAsync";
import sendResponse from "../../../util/sendResponse";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";
import { RidesService } from "./rides.service";
import { pick } from "../../../util/pagination/pagination.utils";
import { RideFilterableFields } from "./rides.constant";
import { paginationFields } from "../../../util/pagination/pagination.constant";
import { EarningFilter } from "./rides.interface";

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

const updateRideAcceptStatus = catchAsync(
  async (req: Request, res: Response) => {
    const token = jwtHelpers.verifyAuthToken(req);
    const { id } = req.params;
    const { ...payload } = req.body;

    const result = await RidesService.updateRideAcceptStatus(
      token,
      id,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride Updated Successfully",
      data: result,
    });
  }
);

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const { id } = req.params;
  const { ...payload } = req.body;

  const result = await RidesService.updateRideStatus(token, id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ride Updated Successfully",
    data: result,
  });
});

const viewMyRides = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const filters = pick(req.query, RideFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await RidesService.viewMyRides(token, filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Rides Retrieved",
    data: result,
  });
});

const viewEarningHistory = catchAsync(async (req: Request, res: Response) => {
  const token = jwtHelpers.verifyAuthToken(req);
  const filter = req.query.filter as unknown as EarningFilter;

  const result = await RidesService.viewEarningHistory(token, filter);

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
  updateRideAcceptStatus,
  updateRideStatus,
  viewMyRides,
  viewEarningHistory,
};
