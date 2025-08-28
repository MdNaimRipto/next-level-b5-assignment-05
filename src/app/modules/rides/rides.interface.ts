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
  createdAt: Date;
}

export interface IUpdateRideStatus {
  acceptStatus: acceptStatusEnums;
  rideStatus: rideStatusEnums;
}

export interface IRideFilters {
  searchTerm?: string;
  from?: string;
  to?: string;
  fair?: string;
  updatedAt?: string;
  acceptStatus?: acceptStatusEnums;
  rideStatus?: rideStatusEnums;
}

export type EarningFilter = "daily" | "weekly" | "monthly";

export interface EarningDashboard {
  totalEarning: number;
  totalCompletedRides: number;
  currentActiveRides: number;
  totalCanceledRides: number;
  filteredEarning: number;
}
