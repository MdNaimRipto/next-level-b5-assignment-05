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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const rides_constant_1 = require("./rides.constant");
const pagination_utils_1 = require("../../../util/pagination/pagination.utils");
const getAllActiveRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_schema_1.Users.find({
        $and: [{ role: "driver" }, { isApproved: true }, { isBlocked: false }],
    }).select("_id userName email contactNumber isActive");
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
const updateRideAcceptStatus = (token, rideId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { acceptStatus } = payload;
    const { role } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    if (role !== "driver") {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only driver can update accept status");
    }
    const ride = yield rides_schema_1.Rides.findOne({ _id: rideId });
    if (!ride)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Ride not found");
    if (ride.acceptStatus === "rejected" || ride.rideStatus === "cancelled") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot update rejected or cancelled rides");
    }
    if (ride.acceptStatus === "accepted" && acceptStatus === "rejected") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This ride has already been accepted and cannot be rejected");
    }
    // ✅ Update
    if (acceptStatus === "rejected") {
        ride.acceptStatus = "rejected";
        ride.cancelledBy = "driver";
    }
    else if (acceptStatus === "accepted") {
        ride.acceptStatus = "accepted";
    }
    yield rides_schema_1.Rides.findOneAndUpdate({ _id: rideId }, ride);
    return null;
});
const updateRideStatus = (token, rideId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideStatus } = payload;
    const { role } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    const ride = yield rides_schema_1.Rides.findOne({ _id: rideId });
    if (!ride)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Ride not found");
    if (ride.acceptStatus === "rejected" || ride.rideStatus === "cancelled") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot update rejected or cancelled rides");
    }
    // 🚫 Cancel rules
    if ((ride.rideStatus === "completed" || ride.rideStatus === "inTransit") &&
        rideStatus === "cancelled") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot cancel completed or ongoing rides");
    }
    if (rideStatus === "cancelled") {
        if (role !== "driver") {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only driver can cancel rides");
        }
        ride.rideStatus = "cancelled";
        ride.cancelledBy = "driver";
    }
    else {
        // pending → inTransit → completed
        if (rideStatus === "inTransit" || rideStatus === "completed") {
            if (role !== "driver") {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only driver can update ride to ongoing or completed");
            }
        }
        ride.rideStatus = rideStatus;
    }
    yield rides_schema_1.Rides.findOneAndUpdate({ _id: rideId }, ride);
    return null;
});
const viewMyRides = (token, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: rides_constant_1.RideSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    //
    if (Object.keys(filterData).length) {
        const filterConditions = [];
        Object.entries(filterData).forEach(([field, value]) => {
            if (field === "from" || field === "to") {
                filterConditions.push({
                    [`location.${field}`]: value,
                });
            }
            else if (field === "fair") {
                const fair = parseInt(value);
                if (!isNaN(fair)) {
                    filterConditions.push({
                        fair: { $lte: fair },
                    });
                }
            }
            else {
                filterConditions.push({ [field]: value });
            }
        });
        andConditions.push({
            $and: filterConditions,
        });
    }
    //
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_utils_1.calculatePaginationFunction)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    //
    const checkAndCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    let result;
    if (role === "rider") {
        result = yield rides_schema_1.Rides.find(Object.assign({ riderId: id }, checkAndCondition))
            .populate([
            {
                path: "driverId",
                select: "userName _id",
            },
        ])
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
    }
    else if (role === "driver") {
        result = yield rides_schema_1.Rides.find(Object.assign({ driverId: id }, checkAndCondition))
            .populate([
            {
                path: "riderId",
                select: "userName _id",
            },
        ])
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
    }
    else {
        result = [];
    }
    const total = yield rides_schema_1.Rides.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const viewEarningHistory = (token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, filter = "monthly") {
    const { role, id } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    if (role !== "driver") {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access. Only drivers can see earnings.");
    }
    // All rides for this driver
    const allRides = yield rides_schema_1.Rides.find({ driverId: id });
    // Cards
    const totalEarning = allRides
        .filter((r) => r.rideStatus === "completed")
        .reduce((sum, r) => sum + (r.fair || 0), 0);
    const totalCompletedRides = allRides.filter((r) => r.rideStatus === "completed").length;
    const currentActiveRides = allRides.filter((r) => r.rideStatus === "inTransit").length;
    const totalCanceledRides = allRides.filter((r) => r.rideStatus === "cancelled").length;
    // Filter timeframe
    const now = new Date();
    let startDate;
    switch (filter) {
        case "daily":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 1); // last 1 day
            break;
        case "weekly":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7); // last 7 days
            break;
        case "monthly":
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1); // last 1 month
            break;
        default:
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);
    }
    // Filtered earnings
    const filteredEarning = allRides
        .filter((r) => r.rideStatus === "completed" && r.createdAt >= startDate)
        .reduce((sum, r) => sum + (r.fair || 0), 0);
    return {
        totalEarning,
        totalCompletedRides,
        currentActiveRides,
        totalCanceledRides,
        filteredEarning, // <-- single value for chart
    };
});
exports.RidesService = {
    getAllActiveRides,
    requestRide,
    updateRideAcceptStatus,
    updateRideStatus,
    viewMyRides,
    viewEarningHistory,
};
