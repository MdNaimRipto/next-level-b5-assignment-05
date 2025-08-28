import { Sos } from "./sos.schema";
import { ISos } from "./sos.interface";
import ApiError from "../../../errors/ApiError";
import httpStats from "http-status";

const requestSos = async (payload: ISos) => {
  const { rideId } = payload;

  const isAlreadyRequested = await Sos.findOne({ rideId, status: false });
  if (isAlreadyRequested) {
    throw new ApiError(httpStats.BAD_REQUEST, "SOS Already Requested");
  }

  const sos = await Sos.create(payload);
  return sos;
};

const getSosByRideId = async (rideId: string) => {
  return await Sos.findOne({ rideId });
};

const updateSosStatus = async (id: string) => {
  const isSosExists = await Sos.findOne({ _id: id });
  if (!isSosExists) {
    throw new ApiError(httpStats.NOT_FOUND, "SOS Not Found");
  }
  return await Sos.findOneAndUpdate({ _id: id }, { status: true });
};

export const SosService = {
  requestSos,
  getSosByRideId,
  updateSosStatus,
};
