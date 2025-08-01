"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const users_schema_1 = require("../users/users.schema");
const http_status_1 = __importDefault(require("http-status"));
const rides_schema_1 = require("./rides.schema");
const config_1 = require("../../../config/config");
const jwt_utils_1 = require("../../../util/jwt/jwt.utils");
const getAllActiveRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_schema_1.Users.find({
        $and: [
            { role: "driver" },
            { isActive: "active" },
            { isApproved: true },
            { isBlocked: false },
        ],
    }).select("_id userName email contactNumber");
    return result;
});
const requestRide = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    if (role !== "rider") {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Only Riders can Request Rides");
    }
    const { riderId, driverId } = payload;
    //   Rider Check
    const isRiderExists = yield users_schema_1.Users.findOne({ _id: riderId }).select("-password");
    if (!isRiderExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Rider Not found");
    }
    if (isRiderExists.isBlocked || !isRiderExists.isVerified) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cannot request rides using this account");
    }
    //   Driver Check
    const isDriverExists = yield users_schema_1.Users.findOne({ _id: driverId }).select("-password");
    if (!isDriverExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Driver Not found");
    }
    if (isDriverExists.isBlocked || !isDriverExists.isVerified) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cannot request rides for this driver account");
    }
    yield rides_schema_1.Rides.create(payload);
    return null;
});
const updateRide = (token, rideId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    console.log({ role });
    const { acceptStatus, rideStatus } = payload;
    const isRideExists = yield rides_schema_1.Rides.findOne({ _id: rideId });
    if (!isRideExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Ride Not found");
    }
    if ((isRideExists.rideStatus === "completed" ||
        isRideExists.rideStatus === "inTransit") &&
        rideStatus === "cancelled") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot cancel completed Or Ongoing rides");
    }
    if (isRideExists.acceptStatus === "rejected" ||
        isRideExists.rideStatus === "cancelled") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot update rejected or canceled rides");
    }
    if (isRideExists.acceptStatus === "accepted" && acceptStatus === "rejected") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This Ride already has been accepted and cannot change the status");
    }
    if (acceptStatus) {
        if (acceptStatus === "rejected") {
            if (role !== "driver") {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only Driver Can Reject Rides");
            }
            isRideExists.acceptStatus = acceptStatus;
            isRideExists.cancelledBy = "driver";
        }
        if (acceptStatus === "accepted") {
            if (role !== "driver") {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only Driver Can Accept Rides");
            }
            isRideExists.acceptStatus = acceptStatus;
        }
    }
    if (rideStatus) {
        if (rideStatus === "cancelled") {
            isRideExists.rideStatus = rideStatus;
            if (role === "driver") {
                isRideExists.cancelledBy = "driver";
            }
            if (role === "rider") {
                isRideExists.cancelledBy = "rider";
            }
        }
        if (rideStatus && rideStatus !== "cancelled") {
            if (rideStatus === "inTransit" || rideStatus === "completed") {
                if (role !== "driver") {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only driver can update ride to ongoing or completed");
                }
            }
            isRideExists.rideStatus = rideStatus;
        }
    }
    yield rides_schema_1.Rides.findOneAndUpdate({ _id: rideId }, isRideExists);
    return null;
});
const viewMyRides = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    let result;
    if (role === "rider") {
        result = yield rides_schema_1.Rides.find({ riderId: id });
    }
    else if (role === "driver") {
        result = yield rides_schema_1.Rides.find({ driverId: id });
    }
    else {
        result = [];
    }
    return result;
});
const viewEarningHistory = (token, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    if (role !== "driver") {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access. Only drivers can see the total earnings.");
    }
    if (role === "driver" && String(id) !== String(driverId)) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only access your own earnings");
    }
    // Fetch all completed rides by this driver
    const completedRides = yield rides_schema_1.Rides.find({
        driverId,
        rideStatus: "completed",
    });
    // Sum all the fares
    const totalFare = completedRides.reduce((sum, ride) => sum + (ride.fair || 0), 0);
    return totalFare;
});
exports.RidesService = {
    getAllActiveRides,
    requestRide,
    updateRide,
    viewMyRides,
    viewEarningHistory,
};
