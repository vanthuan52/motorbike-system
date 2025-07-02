import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ENUM_VEHICLE_MODEL_STATUS,
  VehicleModelPaginationQuery,
  VehicleModelListResponse,
  VehicleModelDetailResponse,
  VehicleModelCreationResponse,
  VehicleModelUpdateResponse,
  VehicleModelDeleteResponse,
  VehicleModelUpdateStatusResponse,
} from "../types";
import { VehicleModel } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const vehicleModelService = {
  getVehicleModelList: async (
    queries?: VehicleModelPaginationQuery
  ): Promise<VehicleModelListResponse> => {
    try {
      const response = await adminApi.get<VehicleModelListResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_MODEL_LIST,
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
    id: string
  ): Promise<VehicleModelDetailResponse> => {
    try {
      const response = await adminApi.get<VehicleModelDetailResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_MODEL_DETAIL(id)
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
  createVehicleModel: async (
    VehicleModel: VehicleModel
  ): Promise<VehicleModelCreationResponse> => {
    try {
      const response: AxiosResponse<VehicleModelCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.VEHICLE_MODEL_CREATE,
          VehicleModel
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(
          response.data.message || "Create vehicle model failed."
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
  updateVehicleModel: async (
    id: string,
    VehicleModel: VehicleModel
  ): Promise<VehicleModelUpdateResponse> => {
    try {
      const response = await adminApi.put<VehicleModelUpdateResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_MODEL_UPDATE(id),
        VehicleModel
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update vehicle model failed."
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
  deleteVehicleModel: async (
    id: string
  ): Promise<VehicleModelDeleteResponse> => {
    try {
      const response = await adminApi.delete<VehicleModelDeleteResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_MODEL_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Delete vehicle model failed."
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
  updateVehicleModelStatus: async (
    id: string,
    status: ENUM_VEHICLE_MODEL_STATUS
  ): Promise<VehicleModelUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<VehicleModelUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_MODEL_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update vehicle model status failed."
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
