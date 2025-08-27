import ApiError from "../../../errors/ApiError";
import { Users } from "../users/users.schema";
import {
  acceptStatusEnums,
  IRides,
  IUpdateRideStatus,
  rideStatusEnums,
} from "./rides.interface";
import httpStatus from "http-status";
import { Rides } from "./rides.schema";
import { IUser } from "../users/users.interface";
import { envConfig } from "../../../config/config";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";

const getAllActiveRides = async (): Promise<IUser[]> => {
  const result = await Users.find({
    $and: [{ role: "driver" }, { isApproved: true }, { isBlocked: false }],
  }).select("_id userName email contactNumber isActive");

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

const updateRideAcceptStatus = async (
  token: string,
  rideId: string,
  acceptStatus: acceptStatusEnums
): Promise<null> => {
  const { role } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);

  if (role !== "driver") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only driver can update accept status"
    );
  }

  const ride = await Rides.findOne({ _id: rideId });
  if (!ride) throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");

  if (ride.acceptStatus === "rejected" || ride.rideStatus === "cancelled") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot update rejected or cancelled rides"
    );
  }

  if (ride.acceptStatus === "accepted" && acceptStatus === "rejected") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This ride has already been accepted and cannot be rejected"
    );
  }

  // ✅ Update
  if (acceptStatus === "rejected") {
    ride.acceptStatus = "rejected";
    ride.cancelledBy = "driver";
  } else if (acceptStatus === "accepted") {
    ride.acceptStatus = "accepted";
  }

  await Rides.findOneAndUpdate({ _id: rideId }, ride);
  return null;
};

const updateRideStatus = async (
  token: string,
  rideId: string,
  rideStatus: rideStatusEnums
): Promise<null> => {
  const { role } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);

  const ride = await Rides.findOne({ _id: rideId });
  if (!ride) throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");

  if (ride.acceptStatus === "rejected" || ride.rideStatus === "cancelled") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot update rejected or cancelled rides"
    );
  }

  // 🚫 Cancel rules
  if (
    (ride.rideStatus === "completed" || ride.rideStatus === "inTransit") &&
    rideStatus === "cancelled"
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel completed or ongoing rides"
    );
  }

  if (rideStatus === "cancelled") {
    if (role !== "driver") {
      throw new ApiError(httpStatus.FORBIDDEN, "Only driver can cancel rides");
    }
    ride.rideStatus = "cancelled";
    ride.cancelledBy = "driver";
  } else {
    // pending → inTransit → completed
    if (rideStatus === "inTransit" || rideStatus === "completed") {
      if (role !== "driver") {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Only driver can update ride to ongoing or completed"
        );
      }
    }
    ride.rideStatus = rideStatus;
  }

  await Rides.findOneAndUpdate({ _id: rideId }, ride);
  return null;
};

const viewMyRides = async (token: string): Promise<IRides[]> => {
  const { role, id } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);
  let result: IRides[];
  if (role === "rider") {
    result = await Rides.find({ riderId: id }).populate([
      {
        path: "driverId",
        select: "userName _id",
      },
    ]);
  } else if (role === "driver") {
    result = await Rides.find({ driverId: id }).populate([
      {
        path: "riderId",
        select: "userName _id",
      },
    ]);
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
  updateRideAcceptStatus,
  updateRideStatus,
  viewMyRides,
  viewEarningHistory,
};
