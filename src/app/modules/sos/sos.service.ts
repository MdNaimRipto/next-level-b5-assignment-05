import { Sos } from "./sos.schema";
import { ISos } from "./sos.interface";

const requestSos = async (payload: ISos) => {
  const sos = await Sos.create(payload);
  return sos;
};

const getSosByRideId = async (rideId: string) => {
  return await Sos.findOne({ _id: rideId });
};

const updateSosStatus = async (rideId: string, status: boolean) => {
  return await Sos.findOneAndUpdate({ rideId }, { status });
};

export const SosService = {
  requestSos,
  getSosByRideId,
  updateSosStatus,
};
