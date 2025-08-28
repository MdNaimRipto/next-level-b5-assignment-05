import express from "express";
import { AdminController } from "./admin.controller";
import { UserRoleEnums } from "../users/user.constant";
import { checkAuth } from "../../../middlewares/checkAuth";

const router = express.Router();

router.get(
  "/getAllUsers",
  // checkAuth(...UserRoleEnums),
  AdminController.getAllUsers
);

router.get(
  "/getAllRides",
  // checkAuth(...UserRoleEnums),
  AdminController.getAllRides
);

router.patch(
  "/updateUserApproveStatus/:id",
  // checkAuth(...UserRoleEnums),
  AdminController.changeUserApproveStatus
);

router.patch(
  "/updateUserBlockStatus/:id",
  // checkAuth(...UserRoleEnums),
  AdminController.changeUserBlockStatus
);

router.get(
  "/viewAnalytics",
  // checkAuth(...UserRoleEnums),
  AdminController.viewAnalytics
);

export const AdminRouter = router;
