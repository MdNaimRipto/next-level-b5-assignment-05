"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFilterableFields = exports.UserSearchableFields = exports.VehicleTypeEnums = exports.IsActiveEnums = exports.UserRoleEnums = void 0;
exports.UserRoleEnums = ["admin", "driver", "rider"];
exports.IsActiveEnums = ["active", "idle", "offline"];
exports.VehicleTypeEnums = ["bike", "car"];
exports.UserSearchableFields = [
    "userName",
    "email",
    "role",
    "contactNumber",
    // "isVerified",
    // "isActive",
    // "isApproved",
    // "isBlocked",
];
exports.UserFilterableFields = [
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
