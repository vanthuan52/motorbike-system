import { AxiosError } from "axios";
import { publicApi } from "@/lib/axios";
import {
  VehicleServicePaginationQuery,
  VehicleServiceListResponse,
  VehicleServiceDetailResponse,
} from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";

const vehicleServiceService = {
  getVehicleServiceList: async (
    queries?: VehicleServicePaginationQuery
  ): Promise<VehicleServiceListResponse> => {
    try {
      const response = await publicApi.get<VehicleServiceListResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_SERVICE_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle service list failed."
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
  getVehicleServiceDetail: async (
    slug: string
  ): Promise<VehicleServiceDetailResponse> => {
    try {
      const response = await publicApi.get<VehicleServiceDetailResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_SERVICE_DETAIL(slug)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle Service details failed."
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

export default vehicleServiceService;
