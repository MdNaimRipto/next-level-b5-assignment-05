"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.get("/getAllUsers", admin_controller_1.AdminController.getAllUsers);
router.get("/getAllRides", admin_controller_1.AdminController.getAllRides);
router.patch("/updateApproveStatus/:id", admin_controller_1.AdminController.changeUserApproveStatus);
router.patch("/updateBlockStatus/:id", admin_controller_1.AdminController.changeUserBlockStatus);
exports.AdminRouter = router;
