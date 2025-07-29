import { Request } from "express";
import jwt, { JwtPayload, Secret, sign, SignOptions } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createToken = (
  payload: object,
  secret: Secret,
  expireTime: string
): string => {
  return sign(payload, secret, {
    expiresIn: expireTime,
  } as SignOptions);
};

const jwtVerify = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

const verifyAuthToken = (req: Request) => {
  const authorizationHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (!authorizationHeader) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Authorization Token is Missing"
    );
  }

  // Extract the token from the Authorization header
  const token = authorizationHeader.replace("Bearer ", "");

  return token;
};

export const jwtHelpers = {
  createToken,
  jwtVerify,
  verifyAuthToken,
};
