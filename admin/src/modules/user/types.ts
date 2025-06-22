import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { Role } from "../role/types";
import { ApiResponse } from "@/types/api.type";

export enum ENUM_USER_SIGN_UP_FROM {
  ADMIN = "admin",
  PUBLIC = "public",
  SEED = "seed",
}

export enum ENUM_USER_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

export enum ENUM_USER_GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface UserPaginationQuery extends PaginationQuery {
  gender?: string;
  status?: ENUM_USER_STATUS;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  status: ENUM_USER_STATUS;
  phone?: string;
  photo?: string;
  gender?: ENUM_USER_GENDER;
  dob?: string;
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  role?: Role;
}

// User profile
export interface UserProfile extends User {
  role: Role;
}

export interface UserProfileResponseData extends User {
  role: Role;
}

export type UserProfileResponse = ApiResponse<UserProfileResponseData>;

// User list
export type UserListResponse = ApiResponse<User[]>;

// User detail
export type UserDetailResponse = ApiResponse<User>;

// user create
export type UserCreationResponse = ApiResponse<User["_id"]>;
