export type userRoleEnums = "admin" | "rider" | "driver";
export type isActiveEnums = "active" | "offline" | "idle";
export type vehicleTypeEnums = "car" | "bike";

export interface IUser {
  userName: string;
  email: string;
  contactNumber: string;
  password: string;
  role: userRoleEnums;
  isVerified: boolean;
  isActive: isActiveEnums;
  isApproved: boolean;
  isBlocked: boolean;
  vehicle: {
    type: vehicleTypeEnums;
    number: string;
  } | null;
}

export interface IVerifyAccount {
  email: string;
  contactNumber: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthenticatedUser {
  accessToken: string;
  refreshToken: string;
}

export interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUserFilters {
  searchTerm?: string;
  userName?: string;
  email?: string;
  role?: userRoleEnums;
  isVerified?: string;
  isActive?: string;
  isApproved?: string;
  isBlocked?: string;
  contactNumber?: string;
}
