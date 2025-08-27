import ApiError from "../../../errors/ApiError";
import { IRides } from "../rides/rides.interface";
import { Rides } from "../rides/rides.schema";
import { IUser, userRoleEnums } from "../users/users.interface";
import { Users } from "../users/users.schema";
import { checkIsAdmin } from "./admin.utils";
import httpStatus from "http-status";

const getAllUsers = async (
  token: string,
  role: userRoleEnums
): Promise<IUser[]> => {
  checkIsAdmin(token);

  const roleFilter = role ? { role } : {};

  const allUsers = await Users.find(roleFilter).select(
    "_id userName email contactNumber role isBlocked"
  );

  const result = allUsers.filter((user) => user.role !== "admin");

  return result;
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

export const AdminService = {
  getAllUsers,
  getAllRides,
  changeUserApproveStatus,
  changeUserBlockStatus,
};
