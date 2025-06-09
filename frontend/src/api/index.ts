import axios, { AxiosInstance } from "axios";
import { APP_CONFIG } from "@/config";
import { formatToApiUrl } from "@/utils/format-to-api-url";
import { ACCESS_TOKEN_KEY } from "@/constant/constant";
import authService from "@/features/auth/auth.service";
import { AuthRefreshTokenResponseData } from "@/features/auth/types";
import { ROUTER_PATH } from "@/constant/router-path";

// --- Global variables to manage token refreshing ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  instance.interceptors.request.use(
    (config) => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
          : null;

      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }

      if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          })
            .then((value: unknown) => {
              originalRequest.headers.Authorization = "Bearer " + value;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { accessToken: newAccessToken }: AuthRefreshTokenResponseData =
            await authService.refreshToken();
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          return axios(originalRequest);
        } catch (err) {
          processQueue(err, null);

          window.localStorage.removeItem(ACCESS_TOKEN_KEY);

          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

          window.location.href = ROUTER_PATH.LOGIN;

          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const publicApi = createAxiosInstance(
  formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_PUBLIC
  )
);
export const sharedApi = createAxiosInstance(
  formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_SHARED
  )
);
export const adminApi = createAxiosInstance(
  formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_ADMIN
  )
);
export const systemApi = createAxiosInstance(
  formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_SYSTEM
  )
);
export const userApi = createAxiosInstance(
  formatToApiUrl(
    APP_CONFIG.API_URL,
    APP_CONFIG.API_PREFIX,
    APP_CONFIG.API_VERSION,
    APP_CONFIG.API_URL_USER
  )
);
