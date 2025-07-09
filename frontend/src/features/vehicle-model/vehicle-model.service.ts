import { AxiosError } from "axios";
import { publicApi } from "@/lib/axios";
import {
  VehicleModelPaginationQuery,
  VehicleModelListResponse,
  VehicleModelDetailResponse,
} from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";

const vehicleModelService = {
  getVehicleModelList: async (
    queries?: VehicleModelPaginationQuery
  ): Promise<VehicleModelListResponse> => {
    try {
      const response = await publicApi.get<VehicleModelListResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_MODEL_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle model list failed."
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
  getVehicleModelDetail: async (
    slug: string
  ): Promise<VehicleModelDetailResponse> => {
    try {
      const response = await publicApi.get<VehicleModelDetailResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_MODEL_DETAIL(slug)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle model details failed."
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

export default vehicleModelService;
