import axios, { AxiosInstance } from "axios";
import { APP_CONFIG } from "@/config";
import { formatToApiUrl } from "@/utils/format-to-api-url";
import { ACCESS_TOKEN_KEY } from "@/constant/constant";

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
      console.log("error: ", error);
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
