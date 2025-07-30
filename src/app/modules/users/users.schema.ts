import { model, Schema } from "mongoose";
import { IUser } from "./users.interface";
import { IsActiveEnums, UserRoleEnums } from "./user.constant";

export const usersSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^01[3-9]\d{8}$/,
        "Please provide a valid Bangladeshi phone number",
      ],
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: UserRoleEnums },
    isVerified: { type: Boolean, required: true, default: false },
    isActive: {
      type: String,
      enum: IsActiveEnums,
      required: true,
      default: "offline",
    },
    isApproved: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Users = model<IUser>("Users", usersSchema);
