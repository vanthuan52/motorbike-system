import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api.type";
import { adminApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import {
  UserPaginationQuery,
  UserListResponse,
  UserDetailResponse,
  User,
  UserCreationResponse,
  UserUpdateResponse,
  ENUM_USER_STATUS,
  UserUpdateStatusResponse,
} from "../user/types";

const customerServices = {
  getCustomers: async (
    queries?: UserPaginationQuery
  ): Promise<UserListResponse> => {
    try {
      // User with role type equaling to 'USER' is called customer
      const response = await adminApi.get<UserListResponse>(
        API_ENDPOINTS.ADMIN.USER_LIST_TYPE_USER,
        {
          params: queries,
        }
      );

      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get user list failed.");
      }
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  getCustomerDetail: async (id: string): Promise<UserDetailResponse> => {
    try {
      const response = await adminApi.get<UserDetailResponse>(
        API_ENDPOINTS.ADMIN.USER_DETAIL(id)
      );

      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Create user failed.");
      }
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  createCustomer: async (user: User): Promise<UserCreationResponse> => {
    try {
      const response = await adminApi.post<UserCreationResponse>(
        API_ENDPOINTS.ADMIN.USER_TYPE_USER_CREATE,
        user
      );

      if (response.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Create user failed.");
      }
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  updateCustomer: async (
    id: string,
    user: User
  ): Promise<UserUpdateResponse> => {
    try {
      const response = await adminApi.put<UserUpdateResponse>(
        API_ENDPOINTS.ADMIN.USER_UPDATE(id),
        user
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Update user failed.");
      }
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  updateCustomerStatus: async (
    id: string,
    status: ENUM_USER_STATUS
  ): Promise<UserUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<UserUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.USER_UPDATE_STATUS(id),
        {
          status,
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Update user status failed.");
      }
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  deleteCustomer: async (id: string): Promise<UserUpdateStatusResponse> => {
    try {
      const response = await adminApi.delete<UserUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.USER_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Delete user failed.");
      }
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default customerServices;
