import { model, Schema, Types } from "mongoose";
import {
  AcceptStatusEnums,
  CancelByEnum,
  RideStatusEnums,
} from "./rides.constant";

const ridesSchema = new Schema({
  riderId: {
    type: Types.ObjectId,
    required: true,
    ref: "Users",
  },
  driverId: {
    type: Types.ObjectId,
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
});

export const Rides = model("Rides", ridesSchema);
