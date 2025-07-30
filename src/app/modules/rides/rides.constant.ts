import {
  acceptStatusEnums,
  rideStatusEnums,
  canceledByEnum,
} from "./rides.interface";

export const AcceptStatusEnums: acceptStatusEnums[] = [
  "accepted",
  "rejected",
  "requested",
];
export const RideStatusEnums: rideStatusEnums[] = [
  "pending",
  "inTransit",
  "completed",
  "cancelled",
];
export const CancelByEnum: canceledByEnum[] = ["none", "rider", "driver"];
