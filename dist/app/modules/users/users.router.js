"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const zodValidationRequest_1 = __importDefault(require("../../../middlewares/zodValidationRequest"));
const users_validation_1 = require("./users.validation");
const router = express_1.default.Router();
router.post("/register", (0, zodValidationRequest_1.default)(users_validation_1.UserValidation.usersZodSchema), users_controller_1.UserController.userRegister);
router.patch("/verifyAccount", users_controller_1.UserController.verifyAccount);
router.post("/login", (0, zodValidationRequest_1.default)(users_validation_1.UserValidation.loginUserZodSchema), users_controller_1.UserController.userLogin);
router.get("/me", users_controller_1.UserController.getAuthenticatedUserDetails);
router.post("/logout", users_controller_1.UserController.logout);
router.post("/refresh-token", users_controller_1.UserController.getNewAccessToken);
router.patch("/updateUser", (0, zodValidationRequest_1.default)(users_validation_1.UserValidation.userUpdateZodSchema), 
// checkAuth(...UserRoleEnums),
users_controller_1.UserController.updatedUser);
router.patch("/updatePassword", (0, zodValidationRequest_1.default)(users_validation_1.UserValidation.updatePasswordZodSchema), 
// checkAuth(...UserRoleEnums),
users_controller_1.UserController.updatePassword);
router.patch("/updateActiveStatus", 
// checkAuth(...UserRoleEnums),
users_controller_1.UserController.updateActiveStatus);
exports.UserRouter = router;
