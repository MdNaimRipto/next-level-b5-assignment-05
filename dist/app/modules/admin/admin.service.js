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
exports.AdminService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const pagination_utils_1 = require("../../../util/pagination/pagination.utils");
const rides_schema_1 = require("../rides/rides.schema");
const user_constant_1 = require("../users/user.constant");
const users_schema_1 = require("../users/users.schema");
const admin_utils_1 = require("./admin.utils");
const http_status_1 = __importDefault(require("http-status"));
const getAllUsers = (token, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    (0, admin_utils_1.checkIsAdmin)(token);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.UserSearchableFields.map((field) => ({
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
            filterConditions.push({ [field]: String(value) });
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
    const allUsers = yield users_schema_1.Users.find(Object.assign({}, checkAndCondition))
        .select("_id userName email contactNumber role isBlocked isApproved isActive")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const result = allUsers.filter((user) => user.role !== "admin");
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
const getAllRides = (token) => __awaiter(void 0, void 0, void 0, function* () {
    (0, admin_utils_1.checkIsAdmin)(token);
    const result = yield rides_schema_1.Rides.find().populate([
        {
            path: "driverId",
            select: "userName email _id",
        },
        {
            path: "riderId",
            select: "userName _id",
        },
    ]);
    return result;
});
const changeUserApproveStatus = (token, userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, admin_utils_1.checkIsAdmin)(token);
    const isUserExists = yield users_schema_1.Users.findOne({ _id: userId });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Does Not Exists");
    }
    yield users_schema_1.Users.findOneAndUpdate({ _id: userId }, { isApproved: isUserExists.isApproved === true ? false : true });
    return null;
});
const changeUserBlockStatus = (token, userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, admin_utils_1.checkIsAdmin)(token);
    const isUserExists = yield users_schema_1.Users.findOne({ _id: userId });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Does Not Exists");
    }
    yield users_schema_1.Users.findOneAndUpdate({ _id: userId }, { isBlocked: isUserExists.isBlocked === true ? false : true });
    return null;
});
const viewAnalytics = (token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, filter = "monthly") {
    (0, admin_utils_1.checkIsAdmin)(token);
    // All rides for this driver
    const allRides = yield rides_schema_1.Rides.find({});
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
exports.AdminService = {
    getAllUsers,
    getAllRides,
    changeUserApproveStatus,
    changeUserBlockStatus,
    viewAnalytics,
};
