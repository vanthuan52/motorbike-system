import { AxiosError } from "axios";
import { publicApi } from "@/api";
import {
  AuthLoginResponse,
  AuthLoginResponseData,
  AuthRefreshTokenResponseData,
  LoginCredentials,
} from "./types";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const authService = {
  loginCredentials: async (
    credentials: LoginCredentials
  ): Promise<AuthLoginResponseData> => {
    try {
      const response = await publicApi.post<AuthLoginResponse>(
        API_ENDPOINTS.AUTH_LOGIN_CREDENTIAL,
        credentials
      );

      if (response.data.statusCode === 200 && response.data.data) {
        const { tokenType, roleType, expiresIn, accessToken, refreshToken } =
          response.data.data;
        return { tokenType, roleType, expiresIn, accessToken, refreshToken };
      } else {
        throw new Error(response.data.message || "Login failed. Try again.");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  refreshToken: async (): Promise<AuthRefreshTokenResponseData> => {
    try {
      const response = await publicApi.post<AuthLoginResponse>(
        API_ENDPOINTS.AUTH_REFRESH_TOKEN
      );
      if (response.data.statusCode === 200 && response.data.data) {
        const { tokenType, roleType, expiresIn, accessToken, refreshToken } =
          response.data.data;
        return { tokenType, roleType, expiresIn, accessToken, refreshToken };
      } else {
        throw new Error(response.data.message || "Refresh token failed.");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default authService;
