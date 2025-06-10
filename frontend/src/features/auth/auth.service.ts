import localStorageHelper from "@/utils/local-storage.helper";
import {
  AuthLoginResponse,
  AuthLoginResponseData,
  AuthRefreshTokenResponse,
  AuthRefreshTokenResponseData,
  LoginCredentials,
} from "./types";
import {
  ACCESS_TOKEN_EXPIRES_IN_KEY,
  ACCESS_TOKEN_KEY,
} from "@/constant/constant";

const authService = {
  loginCredentials: async (
    credentials: LoginCredentials
  ): Promise<AuthLoginResponseData> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });

      const result: AuthLoginResponse = await response.json();

      if (!response.ok || !result.data) {
        throw new Error(result?.message || "Login failed. Try again.");
      }
      localStorageHelper.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
      localStorageHelper.setItem(
        ACCESS_TOKEN_EXPIRES_IN_KEY,
        result.data.expiresIn.toString()
      );
      return result.data;
    } catch (error: any) {
      throw new Error(error?.message || "An unexpected error.");
    }
  },

  refreshToken: async (): Promise<AuthRefreshTokenResponseData> => {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result: AuthRefreshTokenResponse = await response.json();

      if (!response.ok || !result.data) {
        throw new Error(result?.message || "Refresh token failed");
      }

      localStorageHelper.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
      localStorageHelper.setItem(
        ACCESS_TOKEN_EXPIRES_IN_KEY,
        result.data.expiresIn.toString()
      );

      return result.data;
    } catch (error: any) {
      throw new Error(error?.message || "An unexpected error.");
    }
  },
};

export default authService;
