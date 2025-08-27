import { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../../../config/config";
import { IJwtPayload, jwtHelpers } from "../../../util/jwt/jwt.utils";
import { Users } from "./users.schema";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const { email } = jwtHelpers.jwtVerify(
    refreshToken,
    envConfig.jwt_refresh_secret
  ) as IJwtPayload;

  const isUserExist = await Users.findOne({ email: email });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  if (isUserExist.isBlocked) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot access blocked account`);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    envConfig.jwt_access_secret,
    envConfig.jwt_access_expires_in
  );

  return accessToken;
};
