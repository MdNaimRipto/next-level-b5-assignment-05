import express from "express";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { RidesController } from "./rides.controller";
import { RidesValidation } from "./rides.validation";
// import { UserRoleEnums } from "../users/user.constant";
// import { checkAuth } from "../../../middlewares/checkAuth";

const router = express.Router();

router.get("/activeRides", RidesController.getAllActiveRides);

router.post(
  "/requestRide",
  zodValidationRequest(RidesValidation.ridesZodSchema),
  // checkAuth(...UserRoleEnums),
  RidesController.requestRide
);
router.patch(
  "/updateRideAcceptStatus/:id",
  // checkAuth(...UserRoleEnums),
  RidesController.updateRideAcceptStatus
);

router.patch(
  "/updateRideStatus/:id",
  // checkAuth(...UserRoleEnums),
  RidesController.updateRideStatus
);

router.get(
  "/viewMyRides",
  // checkAuth(...UserRoleEnums),
  RidesController.viewMyRides
);

router.get(
  "/viewEarningHistory/:id",
  // checkAuth(...UserRoleEnums),
  RidesController.viewEarningHistory
);

export const RidesRouter = router;
