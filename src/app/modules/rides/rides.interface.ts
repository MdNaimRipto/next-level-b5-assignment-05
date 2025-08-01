import { Types } from "mongoose";

export type acceptStatusEnums = "requested" | "accepted" | "rejected";
export type rideStatusEnums =
  | "pending"
  | "inTransit"
  | "completed"
  | "cancelled";
export type canceledByEnum = "none" | "rider" | "driver";

export interface IRides {
  riderId: Types.ObjectId;
  driverId: Types.ObjectId;
  acceptStatus: acceptStatusEnums;
  rideStatus: rideStatusEnums;
  location: {
    from: string;
    to: string;
  };
  fair: number;
  cancelledBy?: canceledByEnum;
}

export interface IUpdateRideStatus {
  acceptStatus: acceptStatusEnums;
  rideStatus: rideStatusEnums;
}
