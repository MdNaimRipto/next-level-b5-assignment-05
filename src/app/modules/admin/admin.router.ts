import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/getAllUsers", AdminController.getAllUsers);

router.get("/getAllRides", AdminController.getAllRides);

router.patch(
  "/updateApproveStatus/:id",
  AdminController.changeUserApproveStatus
);

router.patch("/updateBlockStatus/:id", AdminController.changeUserBlockStatus);

export const AdminRouter = router;
