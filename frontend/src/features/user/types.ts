import { BaseEntity } from "@/types/base.type";
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
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  status: ENUM_USER_STATUS;
  phone?: string;
  gender?: ENUM_USER_GENDER;
  dob?: string;
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  username?: string;
}

export interface UserProfile extends User {
  role: Role;
}

export interface UserProfileResponseData extends User {
  role: Role;
}

export type UserProfileResponse = ApiResponse<UserProfileResponseData>;

export type UserListResponse = ApiResponse<User[]>;
