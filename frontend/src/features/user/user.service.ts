import { AxiosError } from "axios";
import { UserProfileResponse, UserProfileResponseData } from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { sharedApi } from "@/services";
import { API_ENDPOINTS } from "@/constant/api-endpoint";

const userService = {
  getProfile: async (): Promise<UserProfileResponseData> => {
    try {
      const response = await sharedApi.get<UserProfileResponse>(
        API_ENDPOINTS.SHARED.USER_PROFILE
      );

      if (response.data.statusCode === 200 && response.data.data) {
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
};

export default userService;
