"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsAdmin = void 0;
const config_1 = require("../../../config/config");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwt_utils_1 = require("../../../util/jwt/jwt.utils");
const http_status_1 = __importDefault(require("http-status"));
const checkIsAdmin = (token) => {
    const { role } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    if (role !== "admin") {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Permission Denied. Only Admin Can Access This API");
    }
};
exports.checkIsAdmin = checkIsAdmin;
