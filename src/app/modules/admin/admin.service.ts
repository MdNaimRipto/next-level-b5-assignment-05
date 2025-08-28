import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import {
  IGenericPaginationResponse,
  IPaginationOptions,
} from "../../../util/pagination/pagination.interface";
import { calculatePaginationFunction } from "../../../util/pagination/pagination.utils";
import {
  EarningDashboard,
  EarningFilter,
  IRides,
} from "../rides/rides.interface";
import { Rides } from "../rides/rides.schema";
import { UserSearchableFields } from "../users/user.constant";
import { IUser, IUserFilters, userRoleEnums } from "../users/users.interface";
import { Users } from "../users/users.schema";
import { checkIsAdmin } from "./admin.utils";
import httpStatus from "http-status";

const getAllUsers = async (
  token: string,
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericPaginationResponse<IUser[]>> => {
  checkIsAdmin(token);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: UserSearchableFields.map((field) => ({
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
      filterConditions.push({ [field]: String(value) });
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

  const allUsers = await Users.find({ ...checkAndCondition })
    .select(
      "_id userName email contactNumber role isBlocked isApproved isActive"
    )
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const result = allUsers.filter((user) => user.role !== "admin");

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

const getAllRides = async (token: string): Promise<IRides[]> => {
  checkIsAdmin(token);

  const result = await Rides.find().populate([
    {
      path: "driverId",
      select: "userName email _id",
    },
    {
      path: "riderId",
      select: "userName _id",
    },
  ]);
  return result;
};

const changeUserApproveStatus = async (
  token: string,
  userId: string
): Promise<null> => {
  checkIsAdmin(token);

  const isUserExists = await Users.findOne({ _id: userId });
  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exists");
  }

  await Users.findOneAndUpdate(
    { _id: userId },
    { isApproved: isUserExists.isApproved === true ? false : true }
  );

  return null;
};

const changeUserBlockStatus = async (
  token: string,
  userId: string
): Promise<null> => {
  checkIsAdmin(token);

  const isUserExists = await Users.findOne({ _id: userId });
  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exists");
  }

  await Users.findOneAndUpdate(
    { _id: userId },
    { isBlocked: isUserExists.isBlocked === true ? false : true }
  );

  return null;
};

const viewAnalytics = async (
  token: string,
  filter: EarningFilter = "monthly"
): Promise<EarningDashboard> => {
  checkIsAdmin(token);

  // All rides for this driver
  const allRides = await Rides.find({});

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

export const AdminService = {
  getAllUsers,
  getAllRides,
  changeUserApproveStatus,
  changeUserBlockStatus,
  viewAnalytics,
};
