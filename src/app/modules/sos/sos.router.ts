import { Router } from "express";
import { SosController } from "./sos.controller";

const router = Router();

router.post("/requestSos", SosController.requestSos); // RequestSos
router.get("/getRideSos/:id", SosController.getSosByRideId); // GetSosUsingRideId
router.patch("/updateStatus/:id", SosController.updateSosStatus); // updateSosStatus

export const SosRouter = router;
