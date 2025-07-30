import express from "express";
import { UserRouter } from "../modules/users/users.router";
import { RidesRouter } from "../modules/rides/rides.router";

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
];

routes.map((r) => router.use(r.path, r.route));

export const Routers = router;
