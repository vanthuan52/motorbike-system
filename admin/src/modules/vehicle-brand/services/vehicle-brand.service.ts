import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ENUM_VEHICLE_BRAND_STATUS,
  VehicleBrandPaginationQuery,
  VehicleBrandListResponse,
  VehicleBrandDetailResponse,
  VehicleBrandCreationResponse,
  VehicleBrandUpdateResponse,
  VehicleBrandDeleteResponse,
  VehicleBrandUpdateStatusResponse,
} from "../types";
import { VehicleBrand } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const vehicleBrandService = {
  getVehicleBrandList: async (
    queries?: VehicleBrandPaginationQuery
  ): Promise<VehicleBrandListResponse> => {
    try {
      const response = await adminApi.get<VehicleBrandListResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_BRAND_LIST,
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
      const response = await adminApi.get<VehicleBrandDetailResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_BRAND_DETAIL(id)
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
  createVehicleBrand: async (
    VehicleBrand: VehicleBrand
  ): Promise<VehicleBrandCreationResponse> => {
    try {
      const response: AxiosResponse<VehicleBrandCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.VEHICLE_BRAND_CREATE,
          VehicleBrand
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(
          response.data.message || "Create vehicle brand failed."
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
  updateVehicleBrand: async (
    id: string,
    vehicleBrand: VehicleBrand
  ): Promise<VehicleBrandUpdateResponse> => {
    try {
      const response = await adminApi.put<VehicleBrandUpdateResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_BRAND_UPDATE(id),
        vehicleBrand
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update vehicle brand failed."
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
  deleteVehicleBrand: async (
    id: string
  ): Promise<VehicleBrandDeleteResponse> => {
    try {
      const response = await adminApi.delete<VehicleBrandDeleteResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_BRAND_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Delete vehicle brand failed."
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
  updateVehicleBrandStatus: async (
    id: string,
    status: ENUM_VEHICLE_BRAND_STATUS
  ): Promise<VehicleBrandUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<VehicleBrandUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_BRAND_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update vehicle brand status failed."
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
