import ApiError from "../../../errors/ApiError";
import { Users } from "../users/users.schema";
import { IRides, IUpdateRideStatus } from "./rides.interface";
import httpStatus from "http-status";
import { Rides } from "./rides.schema";
import { IUser } from "../users/users.interface";
import { envConfig } from "../../../config/config";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";

const getAllActiveRides = async (): Promise<IUser[]> => {
  const result = await Users.find({
    $and: [
      { role: "driver" },
      { isActive: "active" },
      { isApproved: true },
      { isBlocked: false },
    ],
  }).select("_id userName email contactNumber");

  return result;
};

const requestRide = async (token: string, payload: IRides): Promise<null> => {
  const { role } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);

  if (role !== "rider") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only Riders can Request Rides"
    );
  }

  const { riderId, driverId } = payload;

  //   Rider Check
  const isRiderExists = await Users.findOne({ _id: riderId }).select(
    "-password"
  );
  if (!isRiderExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rider Not found");
  }

  if (isRiderExists.isBlocked || !isRiderExists.isVerified) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cannot request rides using this account"
    );
  }

  //   Driver Check
  const isDriverExists = await Users.findOne({ _id: driverId }).select(
    "-password"
  );
  if (!isDriverExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver Not found");
  }

  if (isDriverExists.isBlocked || !isDriverExists.isVerified) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cannot request rides for this driver account"
    );
  }

  await Rides.create(payload);

  return null;
};

const updateRide = async (
  token: string,
  rideId: string,
  payload: Partial<IUpdateRideStatus>
): Promise<null> => {
  const { role } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);

  console.log({ role });

  const { acceptStatus, rideStatus } = payload;

  const isRideExists = await Rides.findOne({ _id: rideId });
  if (!isRideExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ride Not found");
  }

  if (
    (isRideExists.rideStatus === "completed" ||
      isRideExists.rideStatus === "inTransit") &&
    rideStatus === "cancelled"
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel completed Or Ongoing rides"
    );
  }

  if (
    isRideExists.acceptStatus === "rejected" ||
    isRideExists.rideStatus === "cancelled"
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot update rejected or canceled rides"
    );
  }

  if (isRideExists.acceptStatus === "accepted" && acceptStatus === "rejected") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This Ride already has been accepted and cannot change the status"
    );
  }

  if (acceptStatus) {
    if (acceptStatus === "rejected") {
      if (role !== "driver") {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Only Driver Can Reject Rides"
        );
      }

      isRideExists.acceptStatus = acceptStatus;
      isRideExists.cancelledBy = "driver";
    }

    if (acceptStatus === "accepted") {
      if (role !== "driver") {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Only Driver Can Accept Rides"
        );
      }
      isRideExists.acceptStatus = acceptStatus;
    }
  }

  if (rideStatus) {
    if (rideStatus === "cancelled") {
      isRideExists.rideStatus = rideStatus;
      if (role === "driver") {
        isRideExists.cancelledBy = "driver";
      }

      if (role === "rider") {
        isRideExists.cancelledBy = "rider";
      }
    }

    if (rideStatus && rideStatus !== "cancelled") {
      if (rideStatus === "inTransit" || rideStatus === "completed") {
        if (role !== "driver") {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Only driver can update ride to ongoing or completed"
          );
        }
      }
      isRideExists.rideStatus = rideStatus;
    }
  }

  await Rides.findOneAndUpdate({ _id: rideId }, isRideExists);

  return null;
};

const viewMyRides = async (token: string): Promise<IRides[]> => {
  const { role, id } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);
  let result: IRides[];
  if (role === "rider") {
    result = await Rides.find({ riderId: id });
  } else if (role === "driver") {
    result = await Rides.find({ driverId: id });
  } else {
    result = [];
  }

  return result;
};

const viewEarningHistory = async (
  token: string,
  driverId: string
): Promise<number> => {
  const { role, id } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);

  if (role !== "driver") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized access. Only drivers can see the total earnings."
    );
  }

  if (role === "driver" && String(id) !== String(driverId)) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only access your own earnings"
    );
  }

  // Fetch all completed rides by this driver
  const completedRides = await Rides.find({
    driverId,
    rideStatus: "completed",
  });

  // Sum all the fares
  const totalFare = completedRides.reduce(
    (sum, ride) => sum + (ride.fair || 0),
    0
  );

  return totalFare;
};

export const RidesService = {
  getAllActiveRides,
  requestRide,
  updateRide,
  viewMyRides,
  viewEarningHistory,
};
