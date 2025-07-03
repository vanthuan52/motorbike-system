import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { VehicleService } from "../vehicle-service/types";
import { VehicleModel } from "../vehicle-model/types";

export interface ServicePrice extends BaseEntity {
  price: number;
  vehicleService: VehicleService;
  vehicleModel: VehicleModel;
  dateStart: Date | string;
  dateEnd: Date | string | null;
}

export interface ServicePricePaginationQuery extends PaginationQuery {}

export interface ServicePriceResponseData extends ServicePrice {}

export type ServicePriceResponse = ApiResponse<ServicePriceResponseData>;

export interface ServicePriceDetailResponse extends ApiResponse<ServicePrice> {}

export type ServicePriceListResponse = ApiResponse<ServicePrice[]>;

export type ServicePriceCreationResponse = ApiResponse<ServicePrice["_id"]>;

export type ServicePriceUpdateResponse = ApiResponse;

export type ServicePriceDeleteResponse = ApiResponse;
