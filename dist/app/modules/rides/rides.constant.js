"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideFilterableFields = exports.RideSearchableFields = exports.CancelByEnum = exports.RideStatusEnums = exports.AcceptStatusEnums = void 0;
exports.AcceptStatusEnums = [
    "accepted",
    "rejected",
    "requested",
];
exports.RideStatusEnums = [
    "pending",
    "inTransit",
    "completed",
    "cancelled",
];
exports.CancelByEnum = ["none", "rider", "driver"];
exports.RideSearchableFields = ["location.from", "location.to"];
exports.RideFilterableFields = [
    "searchTerm",
    "from",
    "to",
    "fair",
    "updatedAt",
    "rideStatus",
];
