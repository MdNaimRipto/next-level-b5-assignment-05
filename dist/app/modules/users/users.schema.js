"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.usersSchema = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
exports.usersSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^01[3-9]\d{8}$/,
            "Please provide a valid Bangladeshi phone number",
        ],
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: user_constant_1.UserRoleEnums },
    isVerified: { type: Boolean, required: true, default: false },
    isActive: {
        type: String,
        enum: user_constant_1.IsActiveEnums,
        required: true,
        default: "offline",
    },
    isApproved: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    vehicle: {
        type: mongoose_1.Schema.Types.Mixed, // allows null or object
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Users = (0, mongoose_1.model)("Users", exports.usersSchema);
