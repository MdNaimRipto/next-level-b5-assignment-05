"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const usersZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userName: zod_1.z.string({
            required_error: "User Name is Required",
        }),
        email: zod_1.z.string({
            required_error: "Email is Required",
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is Required",
        }),
        password: zod_1.z.string({
            required_error: "Password is Required",
        }),
        role: zod_1.z.enum([...user_constant_1.UserRoleEnums], {
            required_error: "Role is Required",
        }),
    }),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "Email is Required",
        }),
        password: zod_1.z.string({
            required_error: "Password is Required",
        }),
    }),
});
const userUpdateZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userName: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        contactNumber: zod_1.z.string().optional(),
        password: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        role: zod_1.z.string().optional(),
        uid: zod_1.z.string().optional(),
        location: zod_1.z
            .object({
            street: zod_1.z.string().optional(),
            city: zod_1.z.string().optional(),
            district: zod_1.z.string().optional(),
            country: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
const updatePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: "Current Password is Required",
        }),
        newPassword: zod_1.z.string({
            required_error: "New Password is Required",
        }),
        confirmPassword: zod_1.z.string({
            required_error: "Confirm Password is Required",
        }),
        userId: zod_1.z.string({
            required_error: "UID is Required",
        }),
    }),
});
exports.UserValidation = {
    usersZodSchema,
    loginUserZodSchema,
    userUpdateZodSchema,
    updatePasswordZodSchema,
};
