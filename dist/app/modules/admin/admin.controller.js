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
exports.AdminController = void 0;
const catchAsync_1 = __importDefault(require("../../../util/catchAsync"));
const jwt_utils_1 = require("../../../util/jwt/jwt.utils");
const admin_service_1 = require("./admin.service");
const sendResponse_1 = __importDefault(require("../../../util/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_constant_1 = require("../users/user.constant");
const pagination_constant_1 = require("../../../util/pagination/pagination.constant");
const pagination_utils_1 = require("../../../util/pagination/pagination.utils");
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const filters = (0, pagination_utils_1.pick)(req.query, user_constant_1.UserFilterableFields);
    const options = (0, pagination_utils_1.pick)(req.query, pagination_constant_1.paginationFields);
    const result = yield admin_service_1.AdminService.getAllUsers(token, filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Users Retrieved",
        data: result,
    });
}));
const getAllRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const result = yield admin_service_1.AdminService.getAllRides(token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Rides Retrieved",
        data: result,
    });
}));
const changeUserApproveStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.changeUserApproveStatus(token, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Updated Approve Status",
        data: result,
    });
}));
const changeUserBlockStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.changeUserBlockStatus(token, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Updated Blocked Status",
        data: result,
    });
}));
const viewAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const filter = req.query.filter;
    const result = yield admin_service_1.AdminService.viewAnalytics(token, filter);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Analytics Status",
        data: result,
    });
}));
exports.AdminController = {
    getAllUsers,
    getAllRides,
    changeUserApproveStatus,
    changeUserBlockStatus,
    viewAnalytics,
};
