export type userRoleEnums = "admin" | "rider" | "driver";
export type isActiveEnums = "active" | "offline" | "idle";

export interface IUserLocation {
  street: string;
  city: string;
  lat: number;
  lng: number;
}

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
  location: IUserLocation;
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
  userData: Omit<IUser, "password">;
}

export interface IUpdatePassword {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
