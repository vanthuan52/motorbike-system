import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ENUM_VEHICLE_SERVICE_STATUS,
  VehicleServicePaginationQuery,
  VehicleServiceListResponse,
  VehicleServiceDetailResponse,
  VehicleServiceCreationResponse,
  VehicleServiceUpdateResponse,
  VehicleServiceDeleteResponse,
  VehicleServiceUpdateStatusResponse,
} from "../types";
import { VehicleService } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const vehicleServiceService = {
  getVehicleServiceList: async (
    queries?: VehicleServicePaginationQuery
  ): Promise<VehicleServiceListResponse> => {
    try {
      const response = await adminApi.get<VehicleServiceListResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_SERVICE_LIST,
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
    id: string
  ): Promise<VehicleServiceDetailResponse> => {
    try {
      const response = await adminApi.get<VehicleServiceDetailResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_SERVICE_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle service details failed."
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
  createVehicleService: async (
    vehicleService: VehicleService
  ): Promise<VehicleServiceCreationResponse> => {
    try {
      const response: AxiosResponse<VehicleServiceCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.VEHICLE_SERVICE_CREATE,
          vehicleService
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(
          response.data.message || "Create vehicle service failed."
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
  updateVehicleService: async (
    id: string,
    vehicleService: VehicleService
  ): Promise<VehicleServiceUpdateResponse> => {
    try {
      const response = await adminApi.put<VehicleServiceUpdateResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_SERVICE_UPDATE(id),
        vehicleService
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update vehicle service failed."
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
  deleteVehicleService: async (
    id: string
  ): Promise<VehicleServiceDeleteResponse> => {
    try {
      const response = await adminApi.delete<VehicleServiceDeleteResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_SERVICE_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Delete vehicle service failed."
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
  updateVehicleServiceStatus: async (
    id: string,
    status: ENUM_VEHICLE_SERVICE_STATUS
  ): Promise<VehicleServiceUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<VehicleServiceUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_SERVICE_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update vehicle service status failed."
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
