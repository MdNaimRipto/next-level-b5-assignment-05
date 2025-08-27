import express from "express";
import { UserController } from "./users.controller";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { UserValidation } from "./users.validation";
import { checkAuth } from "../../../middlewares/checkAuth";
import { UserRoleEnums } from "./user.constant";

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

router.get("/me", UserController.getAuthenticatedUserDetails);

router.post("/logout", UserController.logout);

router.post("/refresh-token", UserController.getNewAccessToken);

router.patch(
  "/updateUser/:id",
  zodValidationRequest(UserValidation.userUpdateZodSchema),
  checkAuth(...UserRoleEnums),
  UserController.updatedUser
);

router.patch(
  "/updatePassword",
  zodValidationRequest(UserValidation.updatePasswordZodSchema),
  checkAuth(...UserRoleEnums),
  UserController.updatePassword
);

router.patch(
  "/updateActiveStatus",
  checkAuth(...UserRoleEnums),
  UserController.updateActiveStatus
);

export const UserRouter = router;
