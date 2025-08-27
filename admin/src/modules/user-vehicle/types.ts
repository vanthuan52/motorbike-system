import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { User } from "../user/types";
import { VehicleModel } from "../vehicle-model/types";

export interface UserVehicle extends BaseEntity {
  user: User;
  vehicleModel: VehicleModel;
  color?: string;
  licensePlate: string;
  engineNumber?: string;
  chassisNumber?: string;
  photo?: string;
}

export interface VehicleCardProps {
  id: string;
  photo?: string;
  name: string;
  licensePlate: string;
  color?: string;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface UserVehiclePaginationQuery extends PaginationQuery {
  vehicleModel?: string;
}

export interface UserVehicleResponseData extends UserVehicle {}

export type UserVehicleResponse = ApiResponse<UserVehicleResponseData>;

export interface UserVehicleDetailResponse extends ApiResponse<UserVehicle> {}

export type UserVehicleListResponse = ApiResponse<UserVehicle[]>;

export type UserVehicleCreationResponse = ApiResponse<UserVehicle["_id"]>;

export type UserVehicleUpdateResponse = ApiResponse;

export type UserVehicleDeleteResponse = ApiResponse;

export type UserVehicleUpdateStatusResponse = ApiResponse;
