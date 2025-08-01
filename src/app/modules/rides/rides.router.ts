import express from "express";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { RidesController } from "./rides.controller";
import { RidesValidation } from "./rides.validation";

const router = express.Router();

router.get("/activeRides", RidesController.getAllActiveRides);

router.post(
  "/requestRide",
  zodValidationRequest(RidesValidation.ridesZodSchema),
  RidesController.requestRide
);
router.patch("/updateRide/:id", RidesController.updateRide);

router.get("/viewMyRides", RidesController.viewMyRides);

router.get("/viewEarningHistory/:id", RidesController.viewEarningHistory);

export const RidesRouter = router;
