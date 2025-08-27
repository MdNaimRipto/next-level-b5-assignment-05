import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../util/catchAsync";
import sendResponse from "../../../util/sendResponse";
import { SosService } from "./sos.service";

// Request SOS
const requestSos = catchAsync(async (req: Request, res: Response) => {
  const sos = await SosService.requestSos(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "SOS Requested Successfully",
    data: sos,
  });
});

// Get SOS by Ride ID
const getSosByRideId = catchAsync(async (req: Request, res: Response) => {
  const sos = await SosService.getSosByRideId(req.params.rideId);
  if (!sos) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "SOS not found",
      data: null,
    });
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SOS Retrieved",
    data: sos,
  });
});

// Update SOS Status
const updateSosStatus = catchAsync(async (req: Request, res: Response) => {
  const sos = await SosService.updateSosStatus(
    req.params.rideId,
    req.body.status
  );
  if (!sos) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "SOS not found",
      data: null,
    });
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "SOS Status Updated",
    data: sos,
  });
});

export const SosController = {
  requestSos,
  getSosByRideId,
  updateSosStatus,
};
