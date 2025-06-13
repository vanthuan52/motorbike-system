import { AxiosError, AxiosResponse } from "axios";
import { localStorageHelper } from "@/utils/local-storage-helper";
import {
  AuthLoginResponse,
  AuthLoginResponseData,
  AuthRefreshTokenResponse,
  AuthRefreshTokenResponseData,
  LoginCredentials,
} from "./types";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/application";
import { publicApi, sharedApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const authService = {
  loginCredentials: async (
    credentials: LoginCredentials
  ): Promise<AuthLoginResponseData> => {
    try {
      const response: AxiosResponse<AuthLoginResponse> = await publicApi.post(
        API_ENDPOINTS.PUBLIC.AUTH_LOGIN_CREDENTIAL,
        {
          ...credentials,
        }
      );

      const responseData: AuthLoginResponseData | undefined =
        response.data.data;
      if (response.status !== 200 || !responseData) {
        throw new Error(response?.data.message || "An unexpected error.");
      }

      localStorageHelper.setItem(ACCESS_TOKEN_KEY, responseData.accessToken);
      localStorageHelper.setItem(REFRESH_TOKEN_KEY, responseData.refreshToken);

      return responseData;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  refreshToken: async (): Promise<AuthRefreshTokenResponseData> => {
    try {
      const response: AxiosResponse<AuthRefreshTokenResponse> =
        await sharedApi.post(API_ENDPOINTS.SHARED.AUTH_REFRESH_TOKEN);

      const responseData: AuthRefreshTokenResponseData | undefined =
        response.data.data;

      if (response.status !== 200 || !responseData) {
        throw new Error(response?.data.message || "An unexpected error.");
      }

      localStorageHelper.setItem(ACCESS_TOKEN_KEY, responseData.accessToken);
      localStorageHelper.setItem(REFRESH_TOKEN_KEY, responseData.refreshToken);

      return responseData;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default authService;
