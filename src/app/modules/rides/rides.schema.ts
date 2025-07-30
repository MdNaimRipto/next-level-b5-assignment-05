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
    ref: "Users", // or Rider model
  },
  driverId: {
    type: Types.ObjectId,
    required: true,
    ref: "Users", // or User if it's a single collection
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
    from: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    to: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
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
