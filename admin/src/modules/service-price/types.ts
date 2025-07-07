import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { VehicleService } from "../vehicle-service/types";
import { VehicleModel } from "../vehicle-model/types";

export enum ENUM_SERVICE_PRICE_STATUS {
  ACTIVE = "active",
  EXPIRED = "expired",
  UPCOMING = "upcoming",
  NO_PRICE = "no_price",
}
export interface ServicePrice extends BaseEntity {
  price: number;
  vehicleService: VehicleService;
  vehicleModel: VehicleModel;
  dateStart: Date | string;
  dateEnd: Date | string | null;
}

// Object containing service price on a vehicle model
export interface ModelServicePrice {
  vehicleServiceId: string;
  vehicleModelId: string;
  vehicleModelName: string;
  price: number | null;
  dateStart: Date | string | null;
  dateEnd: Date | string | null;
  servicePriceId: string | null;
  status: ENUM_SERVICE_PRICE_STATUS;
}

export interface ServicePricePaginationQuery extends PaginationQuery {}

export interface ServicePriceResponseData extends ServicePrice {}

export type ServicePriceResponse = ApiResponse<ServicePriceResponseData>;

export interface ServicePriceDetailResponse extends ApiResponse<ServicePrice> {}

export type ServicePriceListResponse = ApiResponse<ServicePrice[]>;

export type ServicePriceCreationResponse = ApiResponse<ServicePrice["_id"]>;

export type ServicePriceUpdateResponse = ApiResponse;

export type ServicePriceDeleteResponse = ApiResponse;

export interface ModelServicePricePaginationQuery extends PaginationQuery {}

export type ModelServicePriceListResponse = ApiResponse<ModelServicePrice[]>;
