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
exports.checkAuth = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const jwt_utils_1 = require("../util/jwt/jwt.utils");
const config_1 = require("../config/config");
const users_schema_1 = require("../app/modules/users/users.schema");
const http_status_1 = __importDefault(require("http-status"));
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new ApiError_1.default(403, "No Token Received");
        }
        const { email, role } = jwt_utils_1.jwtHelpers.jwtVerify(accessToken.split(" ")[1], config_1.envConfig.jwt_access_secret);
        const isUserExist = yield users_schema_1.Users.findOne({ email: email });
        if (!isUserExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User does not exist");
        }
        if (!isUserExist.isVerified) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User is not verified");
        }
        if (!authRoles.includes(role)) {
            throw new ApiError_1.default(403, "You are not permitted to view this route!!!");
        }
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
});
exports.checkAuth = checkAuth;
