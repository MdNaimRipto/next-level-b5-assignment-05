import { model, Schema } from "mongoose";
import {
  AcceptStatusEnums,
  CancelByEnum,
  RideStatusEnums,
} from "./rides.constant";
import { IRides } from "./rides.interface";

const ridesSchema = new Schema<IRides>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    driverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    acceptStatus: {
      type: String,
      enum: AcceptStatusEnums,
      required: true,
      default: "requested",
    },
    rideStatus: {
      type: String,
      enum: RideStatusEnums,
      required: true,
      default: "pending",
    },
    location: {
      from: { type: String, require: true },
      to: { type: String, require: true },
    },
    fair: {
      type: Number,
      required: true,
      default: 0,
    },
    cancelledBy: {
      type: String,
      enum: CancelByEnum,
      required: true,
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

export const Rides = model<IRides>("Rides", ridesSchema);
