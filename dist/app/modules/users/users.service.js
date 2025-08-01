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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_schema_1 = require("./users.schema");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../../config/config");
const verifyEmailTemplate_1 = require("../../../util/templates/verifyEmailTemplate");
const jwt_utils_1 = require("../../../util/jwt/jwt.utils");
//* User Register
const userRegister = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, contactNumber, role } = payload;
    const lowercaseEmail = email.toLocaleLowerCase();
    const isExistsUser = yield users_schema_1.Users.findOne({
        $or: [{ email: lowercaseEmail }, { contactNumber }],
    });
    if (isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Email or Contact Number Already Exists");
    }
    if (role === "admin") {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Need authorization to become admin");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.envConfig.salt_round));
    const createdUser = yield users_schema_1.Users.create(Object.assign(Object.assign({}, payload), { email: lowercaseEmail, password: hashedPassword }));
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.envConfig.nodemailer_user,
            pass: config_1.envConfig.nodemailer_pass,
        },
    });
    const verificationLink = `http://localhost:3000/auth/verify?email=${email}&num=${createdUser.contactNumber}`;
    const htmlContent = (0, verifyEmailTemplate_1.verifyEmailTemplate)(createdUser.userName, verificationLink);
    yield transporter.sendMail({
        to: email,
        subject: "Account Verification Mail",
        html: htmlContent,
    });
    return null;
});
// * Verify Account
const verifyAccount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, contactNumber } = payload;
    const lowercaseEmail = email.toLocaleLowerCase();
    const isExistsUser = yield users_schema_1.Users.findOne({
        $and: [{ email: lowercaseEmail }, { contactNumber }],
    });
    if (!isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Email or Contact Number Not found");
    }
    if (isExistsUser.isVerified === true) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Account already verified");
    }
    yield users_schema_1.Users.findOneAndUpdate({
        $and: [{ email: lowercaseEmail }, { contactNumber }],
    }, {
        isActive: "active",
        isApproved: true,
        isVerified: true,
    });
    return null;
});
//* User Login
const userLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isExists = yield users_schema_1.Users.findOne({ email: email });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Email Or Password");
    }
    const { isVerified, isBlocked } = isExists;
    if (isBlocked) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "This account has been blocked by ADMIN and cannot be used anymore");
    }
    if (!isVerified) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Your account is not verified yet. Please check email and verify your account");
    }
    const checkPassword = yield bcrypt_1.default.compare(password, isExists.password);
    if (!checkPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Email Or Password");
    }
    const jwtPayload = {
        email: isExists.email,
        id: isExists._id,
        role: isExists.role,
    };
    const accessToken = jwt_utils_1.jwtHelpers.createToken(jwtPayload, config_1.envConfig.jwt_access_secret, config_1.envConfig.jwt_access_expires_in);
    const refreshToken = jwt_utils_1.jwtHelpers.createToken(jwtPayload, config_1.envConfig.jwt_refresh_secret, config_1.envConfig.jwt_refresh_expires_in);
    const userData = isExists.toObject();
    delete userData.password;
    return {
        accessToken,
        refreshToken,
        userData,
    };
});
//* Update User
const updateUser = (userID, payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    const isExistsUser = yield users_schema_1.Users.findById({ _id: userID });
    if (!isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    const { isBlocked, isVerified, isApproved, isActive, role, password } = payload, updatePayload = __rest(payload, ["isBlocked", "isVerified", "isApproved", "isActive", "role", "password"]);
    if (role !== undefined ||
        password !== undefined ||
        isBlocked !== undefined ||
        isActive !== undefined ||
        isVerified !== undefined ||
        isApproved !== undefined) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Permission Denied! Please Try Again.");
    }
    if (payload.email) {
        if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid email address");
        }
        const isExists = yield users_schema_1.Users.findOne({ email: payload.email });
        if (isExists) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Email Already Exists! Try Another One.");
        }
        updatePayload.email = payload.email;
    }
    if (payload.contactNumber) {
        if (!/^01[3-9]\d{8}$/.test(payload.contactNumber)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please provide a valid Bangladeshi phone number");
        }
        const isExists = yield users_schema_1.Users.findOne({
            contactNumber: payload.contactNumber,
        });
        if (isExists) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Contact Number Already Exists! Try Another One.");
        }
        updatePayload.contactNumber = payload.contactNumber;
    }
    yield users_schema_1.Users.findOneAndUpdate({ _id: userID }, updatePayload, {
        new: true,
    });
    return null;
});
// * For Updating the password
const updatePassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    const { userId, currentPassword, newPassword, confirmPassword } = payload;
    const isExistsUser = yield users_schema_1.Users.findById({ _id: userId });
    if (!isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    const isPassMatched = yield bcrypt_1.default.compare(currentPassword, isExistsUser.password);
    if (!isPassMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect current password. Please try again.");
    }
    const isPreviousPass = yield bcrypt_1.default.compare(newPassword, isExistsUser.password);
    if (isPreviousPass || currentPassword === newPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "New Password Cannot be The Previous Password");
    }
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "New Password and Confirm Password must match.");
    }
    const pass = yield bcrypt_1.default.hash(newPassword, Number(config_1.envConfig.salt_round));
    isExistsUser.password = pass;
    const user = yield users_schema_1.Users.findOneAndUpdate({ _id: userId }, isExistsUser, {
        new: true,
    });
    return null;
});
// * Update Active status
const updateActiveStatus = (token, isActive) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, id } = jwt_utils_1.jwtHelpers.jwtVerify(token, config_1.envConfig.jwt_access_secret);
    const isExistsUser = yield users_schema_1.Users.findOne({ $and: [{ email }, { _id: id }] });
    if (!isExistsUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    yield users_schema_1.Users.findOneAndUpdate({ $and: [{ email }, { _id: id }] }, {
        isActive: isActive,
    });
    return null;
});
exports.UserService = {
    userRegister,
    verifyAccount,
    userLogin,
    updateUser,
    updatePassword,
    updateActiveStatus,
};
