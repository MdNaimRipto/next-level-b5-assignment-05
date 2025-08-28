import {
  isActiveEnums,
  userRoleEnums,
  vehicleTypeEnums,
} from "./users.interface";

export const UserRoleEnums: userRoleEnums[] = ["admin", "driver", "rider"];

export const IsActiveEnums: isActiveEnums[] = ["active", "idle", "offline"];

export const VehicleTypeEnums: vehicleTypeEnums[] = ["bike", "car"];

export const UserSearchableFields = [
  "userName",
  "email",
  "role",
  "contactNumber",
  // "isVerified",
  // "isActive",
  // "isApproved",
  // "isBlocked",
];

export const UserFilterableFields = [
  "searchTerm",
  "userName",
  "email",
  "role",
  "isVerified",
  "isActive",
  "isApproved",
  "isBlocked",
  "contactNumber",
];
