"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesRouter = void 0;
const express_1 = __importDefault(require("express"));
const zodValidationRequest_1 = __importDefault(require("../../../middlewares/zodValidationRequest"));
const rides_controller_1 = require("./rides.controller");
const rides_validation_1 = require("./rides.validation");
const user_constant_1 = require("../users/user.constant");
const checkAuth_1 = require("../../../middlewares/checkAuth");
const router = express_1.default.Router();
router.get("/activeRides", rides_controller_1.RidesController.getAllActiveRides);
router.post("/requestRide", (0, zodValidationRequest_1.default)(rides_validation_1.RidesValidation.ridesZodSchema), (0, checkAuth_1.checkAuth)(...user_constant_1.UserRoleEnums), rides_controller_1.RidesController.requestRide);
router.patch("/updateRide/:id", (0, checkAuth_1.checkAuth)(...user_constant_1.UserRoleEnums), rides_controller_1.RidesController.updateRide);
router.get("/viewMyRides", (0, checkAuth_1.checkAuth)(...user_constant_1.UserRoleEnums), rides_controller_1.RidesController.viewMyRides);
router.get("/viewEarningHistory/:id", (0, checkAuth_1.checkAuth)(...user_constant_1.UserRoleEnums), rides_controller_1.RidesController.viewEarningHistory);
exports.RidesRouter = router;
