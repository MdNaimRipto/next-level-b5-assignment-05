"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SosRouter = void 0;
const express_1 = require("express");
const sos_controller_1 = require("./sos.controller");
const router = (0, express_1.Router)();
router.post("/requestSos", sos_controller_1.SosController.requestSos); // RequestSos
router.get("/getRideSos/:id", sos_controller_1.SosController.getSosByRideId); // GetSosUsingRideId
router.patch("/updateStatus/:id", sos_controller_1.SosController.updateSosStatus); // updateSosStatus
exports.SosRouter = router;
