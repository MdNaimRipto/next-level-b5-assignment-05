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
      from: z.object({
        lat: z.number({
          required_error: "From latitude is required",
        }),
        lng: z.number({
          required_error: "From longitude is required",
        }),
      }),
      to: z.object({
        lat: z.number({
          required_error: "To latitude is required",
        }),
        lng: z.number({
          required_error: "To longitude is required",
        }),
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
