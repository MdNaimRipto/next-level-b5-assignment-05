import express from "express";
import { UserRouter } from "../modules/users/users.router";
import { RidesRouter } from "../modules/rides/rides.router";
import { AdminRouter } from "../modules/admin/admin.router";
import { SosRouter } from "../modules/sos/sos.router";

const router = express.Router();

const routes = [
  {
    path: "/users",
    route: UserRouter,
  },
  {
    path: "/rides",
    route: RidesRouter,
  },
  {
    path: "/admin",
    route: AdminRouter,
  },
  {
    path: "/sos",
    route: SosRouter,
  },
];

routes.map((r) => router.use(r.path, r.route));

export const Routers = router;
