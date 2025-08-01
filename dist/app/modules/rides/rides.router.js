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
const router = express_1.default.Router();
router.get("/activeRides", rides_controller_1.RidesController.getAllActiveRides);
router.post("/requestRide", (0, zodValidationRequest_1.default)(rides_validation_1.RidesValidation.ridesZodSchema), rides_controller_1.RidesController.requestRide);
router.patch("/updateRide/:id", rides_controller_1.RidesController.updateRide);
router.get("/viewMyRides", rides_controller_1.RidesController.viewMyRides);
router.get("/viewEarningHistory/:id", rides_controller_1.RidesController.viewEarningHistory);
exports.RidesRouter = router;
