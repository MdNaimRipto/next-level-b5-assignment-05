import { envConfig } from "../../../config/config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";
import httpStatus from "http-status";

export const checkIsAdmin = (token: string) => {
  const { role } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);
  if (role !== "admin") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Permission Denied. Only Admin Can Access This"
    );
  }
};
