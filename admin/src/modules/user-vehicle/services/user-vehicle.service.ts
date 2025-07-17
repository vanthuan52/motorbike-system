import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  UserVehiclePaginationQuery,
  UserVehicleListResponse,
  UserVehicleDetailResponse,
  UserVehicleCreationResponse,
  UserVehicleUpdateResponse,
  UserVehicleDeleteResponse,
} from "../types";
import { UserVehicle } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const UserVehicleService = {
  getUserVehicleList: async (
    queries?: UserVehiclePaginationQuery
  ): Promise<UserVehicleListResponse> => {
    try {
      const response = await adminApi.get<UserVehicleListResponse>(
        API_ENDPOINTS.ADMIN.USER_VEHICLE_LIST,
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
  getUserVehicleDetail: async (
    id: string
  ): Promise<UserVehicleDetailResponse> => {
    try {
      const response = await adminApi.get<UserVehicleDetailResponse>(
        API_ENDPOINTS.ADMIN.USER_VEHICLE_DETAIL(id)
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
  createUserVehicle: async (
    UserVehicle: UserVehicle
  ): Promise<UserVehicleCreationResponse> => {
    try {
      const response: AxiosResponse<UserVehicleCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.USER_VEHICLE_CREATE,
          UserVehicle
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
  updateUserVehicle: async (
    id: string,
    UserVehicle: UserVehicle
  ): Promise<UserVehicleUpdateResponse> => {
    try {
      const response = await adminApi.put<UserVehicleUpdateResponse>(
        API_ENDPOINTS.ADMIN.USER_VEHICLE_UPDATE(id),
        UserVehicle
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
  deleteUserVehicle: async (id: string): Promise<UserVehicleDeleteResponse> => {
    try {
      const response = await adminApi.delete<UserVehicleDeleteResponse>(
        API_ENDPOINTS.ADMIN.USER_VEHICLE_DELETION(id)
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
};

export default UserVehicleService;
