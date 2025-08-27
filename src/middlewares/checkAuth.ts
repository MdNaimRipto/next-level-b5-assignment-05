import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { IJwtPayload, jwtHelpers } from "../util/jwt/jwt.utils";
import { envConfig } from "../config/config";
import { Users } from "../app/modules/users/users.schema";
import httpStatus from "http-status";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new ApiError(403, "No Token Received");
      }

      const { email, role } = jwtHelpers.jwtVerify(
        accessToken.split(" ")[1],
        envConfig.jwt_access_secret
      ) as IJwtPayload;

      const isUserExist = await Users.findOne({ email: email });

      if (!isUserExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (!isUserExist.isVerified) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User is not verified");
      }

      if (!authRoles.includes(role)) {
        throw new ApiError(403, "You are not permitted to view this route!!!");
      }
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
