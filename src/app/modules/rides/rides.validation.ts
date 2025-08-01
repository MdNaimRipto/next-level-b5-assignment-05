import { z } from "zod";

const ridesZodSchema = z.object({
  body: z.object({
    riderId: z.string({
      required_error: "Rider ID is required",
    }),
    driverId: z.string({
      required_error: "Driver ID is required",
    }),
    location: z.object({
      from: z.string({
        required_error: "From is required",
      }),
      to: z.string({
        required_error: "To ID is required",
      }),
    }),
    fair: z.number({
      required_error: "Fair is required",
    }),
  }),
});

export const RidesValidation = {
  ridesZodSchema,
};
