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
exports.createNewAccessTokenWithRefreshToken = void 0;
const config_1 = require("../../../config/config");
const jwt_utils_1 = require("../../../util/jwt/jwt.utils");
const users_schema_1 = require("./users.schema");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = jwt_utils_1.jwtHelpers.jwtVerify(refreshToken, config_1.envConfig.jwt_refresh_secret);
    const isUserExist = yield users_schema_1.Users.findOne({ email: email });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User does not exist");
    }
    if (isUserExist.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Cannot access blocked account`);
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = jwt_utils_1.jwtHelpers.createToken(jwtPayload, config_1.envConfig.jwt_access_secret, config_1.envConfig.jwt_access_expires_in);
    return accessToken;
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
