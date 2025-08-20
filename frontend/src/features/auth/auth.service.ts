import localStorageHelper from "@/utils/local-storage.helper";
import {
  AuthLoginResponse,
  AuthLoginResponseData,
  AuthRefreshTokenResponse,
  AuthRefreshTokenResponseData,
  AuthRegisterResponseData,
  LoginCredentials,
  RegisterCredentials,
} from "./types";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constant/constant";

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
      localStorageHelper.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
      return result.data;
    } catch (error: any) {
      throw new Error(error?.message || "An unexpected error.");
    }
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<AuthRegisterResponseData> => {
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });

      const result: AuthRegisterResponseData = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Register failed. Try again.");
      }

      return result;
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

      return result.data;
    } catch (error: any) {
      throw new Error(error?.message || "An unexpected error.");
    }
  },
};

export default authService;
