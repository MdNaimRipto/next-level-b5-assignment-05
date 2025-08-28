import ApiError from "../../../errors/ApiError";
import { Users } from "../users/users.schema";
import {
  acceptStatusEnums,
  EarningDashboard,
  EarningFilter,
  IRideFilters,
  IRides,
  IUpdateRideStatus,
  rideStatusEnums,
} from "./rides.interface";
import httpStatus from "http-status";
import { Rides } from "./rides.schema";
import { IUser } from "../users/users.interface";
import { envConfig } from "../../../config/config";
import { jwtHelpers } from "../../../util/jwt/jwt.utils";
import {
  IGenericPaginationResponse,
  IPaginationOptions,
} from "../../../util/pagination/pagination.interface";
import { RideSearchableFields } from "./rides.constant";
import { calculatePaginationFunction } from "../../../util/pagination/pagination.utils";
import { SortOrder } from "mongoose";

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
  payload: {
    acceptStatus: acceptStatusEnums;
  }
): Promise<null> => {
  const { acceptStatus } = payload;

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
  payload: {
    rideStatus: rideStatusEnums;
  }
): Promise<null> => {
  const { rideStatus } = payload;

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

const viewMyRides = async (
  token: string,
  filters: IRideFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericPaginationResponse<IRides[]>> => {
  const { role, id } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: RideSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  //
  if (Object.keys(filterData).length) {
    const filterConditions: { [x: string]: string }[] = [];

    Object.entries(filterData).forEach(([field, value]) => {
      if (field === "from" || field === "to") {
        filterConditions.push({
          [`location.${field}`]: value,
        });
      } else if (field === "fair") {
        const fair = parseInt(value);
        if (!isNaN(fair)) {
          filterConditions.push({
            fair: { $lte: fair } as any,
          });
        }
      } else {
        filterConditions.push({ [field]: value });
      }
    });

    andConditions.push({
      $and: filterConditions,
    });
  }
  //
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePaginationFunction(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  //
  const checkAndCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  let result: IRides[];
  if (role === "rider") {
    result = await Rides.find({ riderId: id, ...checkAndCondition })
      .populate([
        {
          path: "driverId",
          select: "userName _id",
        },
      ])
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
  } else if (role === "driver") {
    result = await Rides.find({ driverId: id, ...checkAndCondition })
      .populate([
        {
          path: "riderId",
          select: "userName _id",
        },
      ])
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
  } else {
    result = [];
  }

  const total = await Rides.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const viewEarningHistory = async (
  token: string,
  filter: EarningFilter = "monthly"
): Promise<EarningDashboard> => {
  const { role, id } = jwtHelpers.jwtVerify(token, envConfig.jwt_access_secret);

  if (role !== "driver") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized access. Only drivers can see earnings."
    );
  }

  // All rides for this driver
  const allRides = await Rides.find({ driverId: id });

  // Cards
  const totalEarning = allRides
    .filter((r) => r.rideStatus === "completed")
    .reduce((sum, r) => sum + (r.fair || 0), 0);

  const totalCompletedRides = allRides.filter(
    (r) => r.rideStatus === "completed"
  ).length;

  const currentActiveRides = allRides.filter(
    (r) => r.rideStatus === "inTransit"
  ).length;

  const totalCanceledRides = allRides.filter(
    (r) => r.rideStatus === "cancelled"
  ).length;

  // Filter timeframe
  const now = new Date();
  let startDate: Date;

  switch (filter) {
    case "daily":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1); // last 1 day
      break;
    case "weekly":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7); // last 7 days
      break;
    case "monthly":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1); // last 1 month
      break;
    default:
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
  }

  // Filtered earnings
  const filteredEarning = allRides
    .filter((r) => r.rideStatus === "completed" && r.createdAt >= startDate)
    .reduce((sum, r) => sum + (r.fair || 0), 0);

  return {
    totalEarning,
    totalCompletedRides,
    currentActiveRides,
    totalCanceledRides,
    filteredEarning, // <-- single value for chart
  };
};

export const RidesService = {
  getAllActiveRides,
  requestRide,
  updateRideAcceptStatus,
  updateRideStatus,
  viewMyRides,
  viewEarningHistory,
};
