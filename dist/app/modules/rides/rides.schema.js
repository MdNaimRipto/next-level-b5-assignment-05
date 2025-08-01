"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rides = void 0;
const mongoose_1 = require("mongoose");
const rides_constant_1 = require("./rides.constant");
const ridesSchema = new mongoose_1.Schema({
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    acceptStatus: {
        type: String,
        enum: rides_constant_1.AcceptStatusEnums,
        required: true,
        default: "requested",
    },
    rideStatus: {
        type: String,
        enum: rides_constant_1.RideStatusEnums,
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
        enum: rides_constant_1.CancelByEnum,
        required: true,
        default: "none",
    },
}, {
    timestamps: true,
});
exports.Rides = (0, mongoose_1.model)("Rides", ridesSchema);
