import { AxiosError } from "axios";
import { publicApi } from "@/lib/axios";
import {
  VehicleBrandPaginationQuery,
  VehicleBrandListResponse,
  VehicleBrandDetailResponse,
} from "./types";
import { VehicleBrand } from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";

const vehicleBrandService = {
  getVehicleBrandList: async (
    queries?: VehicleBrandPaginationQuery
  ): Promise<VehicleBrandListResponse> => {
    try {
      const response = await publicApi.get<VehicleBrandListResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_BRAND_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle brand list failed."
        );
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  getVehicleBrandDetail: async (
    id: string
  ): Promise<VehicleBrandDetailResponse> => {
    try {
      const response = await publicApi.get<VehicleBrandDetailResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_BRAND_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle brand details failed."
        );
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default vehicleBrandService;
