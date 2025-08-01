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
exports.AdminService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const rides_schema_1 = require("../rides/rides.schema");
const users_schema_1 = require("../users/users.schema");
const admin_utils_1 = require("./admin.utils");
const http_status_1 = __importDefault(require("http-status"));
const getAllUsers = (token, role) => __awaiter(void 0, void 0, void 0, function* () {
    (0, admin_utils_1.checkIsAdmin)(token);
    const roleFilter = role ? { role } : {};
    const result = yield users_schema_1.Users.find(roleFilter).select("_id userName email contactNumber");
    return result;
});
const getAllRides = (token) => __awaiter(void 0, void 0, void 0, function* () {
    (0, admin_utils_1.checkIsAdmin)(token);
    const result = yield rides_schema_1.Rides.find();
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
exports.AdminService = {
    getAllUsers,
    getAllRides,
    changeUserApproveStatus,
    changeUserBlockStatus,
};
