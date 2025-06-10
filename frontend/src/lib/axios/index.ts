import axios, { AxiosInstance } from "axios";
import { APP_CONFIG } from "@/config";
import { formatToApiUrl } from "@/utils/format-to-api-url";
import { clearTokens, getTokens, setTokens } from "@/utils/jwt.utils";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { AuthRefreshTokenResponseData } from "@/features/auth/types";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

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
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      const { accessToken } = getTokens();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        const { refreshToken } = getTokens();

        if (!refreshToken) {
          clearTokens();
          processQueue(error);
          return Promise.reject(error);
        }

        try {
          const refreshTokenApi = axios.create({
            baseURL: formatToApiUrl(
              APP_CONFIG.API_URL,
              APP_CONFIG.API_PREFIX,
              APP_CONFIG.API_VERSION,
              APP_CONFIG.API_URL_SHARED
            ),
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const response = await refreshTokenApi.post(
            API_ENDPOINTS.SHARED.AUTH_REFRESH_TOKEN
          );

          const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          }: AuthRefreshTokenResponseData = response.data.data;

          setTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          return Promise.reject(refreshError);
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
