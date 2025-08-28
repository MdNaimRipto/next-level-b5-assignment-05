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
exports.RidesController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../util/sendResponse"));
const jwt_utils_1 = require("../../../util/jwt/jwt.utils");
const rides_service_1 = require("./rides.service");
const pagination_utils_1 = require("../../../util/pagination/pagination.utils");
const rides_constant_1 = require("./rides.constant");
const pagination_constant_1 = require("../../../util/pagination/pagination.constant");
// User Register
const getAllActiveRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rides_service_1.RidesService.getAllActiveRides();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Active Drives Retrieved",
        data: result,
    });
}));
const requestRide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const payload = __rest(req.body, []);
    const result = yield rides_service_1.RidesService.requestRide(token, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Ride Requested Successfully",
        data: result,
    });
}));
const updateRideAcceptStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const { id } = req.params;
    const payload = __rest(req.body, []);
    const result = yield rides_service_1.RidesService.updateRideAcceptStatus(token, id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Ride Updated Successfully",
        data: result,
    });
}));
const updateRideStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const { id } = req.params;
    const payload = __rest(req.body, []);
    const result = yield rides_service_1.RidesService.updateRideStatus(token, id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Ride Updated Successfully",
        data: result,
    });
}));
const viewMyRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const filters = (0, pagination_utils_1.pick)(req.query, rides_constant_1.RideFilterableFields);
    const options = (0, pagination_utils_1.pick)(req.query, pagination_constant_1.paginationFields);
    const result = yield rides_service_1.RidesService.viewMyRides(token, filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "My Rides Retrieved",
        data: result,
    });
}));
const viewEarningHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt_utils_1.jwtHelpers.verifyAuthToken(req);
    const filter = req.query.filter;
    const result = yield rides_service_1.RidesService.viewEarningHistory(token, filter);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Earning History Retrieved",
        data: result,
    });
}));
exports.RidesController = {
    getAllActiveRides,
    requestRide,
    updateRideAcceptStatus,
    updateRideStatus,
    viewMyRides,
    viewEarningHistory,
};
