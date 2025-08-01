"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesValidation = void 0;
const zod_1 = require("zod");
const ridesZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        riderId: zod_1.z.string({
            required_error: "Rider ID is required",
        }),
        driverId: zod_1.z.string({
            required_error: "Driver ID is required",
        }),
        location: zod_1.z.object({
            from: zod_1.z.string({
                required_error: "From is required",
            }),
            to: zod_1.z.string({
                required_error: "To ID is required",
            }),
        }),
        fair: zod_1.z.number({
            required_error: "Fair is required",
        }),
    }),
});
exports.RidesValidation = {
    ridesZodSchema,
};
