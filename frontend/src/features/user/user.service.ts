import { AxiosError } from "axios";
import {
  UserListResponse,
  UserProfileResponse,
  UserProfileResponseData,
} from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { sharedApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { PaginationQuery } from "@/types/base.type";

const userService = {
  getProfile: async (): Promise<UserProfileResponseData> => {
    try {
      const response = await sharedApi.get<UserProfileResponse>(
        API_ENDPOINTS.SHARED.USER_PROFILE
      );

      if (response.status === 200 && response.data.data) {
        const userProfile = response.data.data;
        return userProfile;
      } else {
        throw new Error(response.data.message || "Fetch user profile failed.");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  getListAdminTechnicians: async (
    queries?: PaginationQuery
  ): Promise<UserListResponse> => {
    try {
      const response = await sharedApi.get<UserListResponse>(
        API_ENDPOINTS.SHARED.USER_LIST_TYPE_ADMIN_TECHNICIAN,
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
};

export default userService;
