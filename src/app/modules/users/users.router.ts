import express from "express";
import { UserController } from "./users.controller";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { UserValidation } from "./users.validation";

const router = express.Router();

router.post(
  "/register",
  zodValidationRequest(UserValidation.usersZodSchema),
  UserController.userRegister
);

router.patch("/verifyAccount", UserController.verifyAccount);

router.post(
  "/login",
  zodValidationRequest(UserValidation.loginUserZodSchema),
  UserController.userLogin
);

router.patch(
  "/updateUser/:id",
  zodValidationRequest(UserValidation.userUpdateZodSchema),
  UserController.updatedUser
);

router.patch(
  "/updatePassword",
  zodValidationRequest(UserValidation.updatePasswordZodSchema),
  UserController.updatePassword
);

export const UserRouter = router;
