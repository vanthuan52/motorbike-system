import { AxiosError, AxiosResponse } from "axios";
import {
  HiringStatusEnum,
  Hiring,
  HiringResponse,
  HiringResponseData,
} from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse, ApiResponse } from "@/types/api.type";
import { adminApi } from "@/lib/axios";

type HiringFilter = {
  search?: string;
  page?: number;
  perPage?: number;
  status?: HiringStatusEnum;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};
const hiringService = {
  getHiringList: async (filter?: HiringFilter): Promise<HiringResponse> => {
    try {
      const response: AxiosResponse<HiringResponse> = await adminApi.get(
        API_ENDPOINTS.ADMIN.HIRING,
        {
          params: {
            search: filter?.search || "",
            page: filter?.page || 1,
            perPage: filter?.perPage || 10,
            status: filter?.status || "",
          },
        }
      );
      const responseData: HiringResponse | undefined = response.data;
      if (response.status !== 200 || !responseData) {
        throw new Error(response?.data.message || "An unexpected error.");
      }
      return responseData;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  getHiringDetails: async (id: string): Promise<HiringResponseData> => {
    try {
      const response: AxiosResponse<HiringResponse> = await adminApi.get(
        API_ENDPOINTS.ADMIN.HIRING_DETAILS(id)
      );
      const responseData: HiringResponseData | undefined = response.data.data;
      if (response.status !== 200 || !responseData) {
        throw new Error(response?.data.message || "An unexpected error.");
      }
      return responseData;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  createHiring: async (hiring: Hiring): Promise<HiringResponseData> => {
    try {
      const response: AxiosResponse<HiringResponse> = await adminApi.post(
        API_ENDPOINTS.ADMIN.HIRING_CREATE,
        hiring
      );
      const responseData: HiringResponseData | undefined = response.data.data;
      if (response.status !== 201 || !responseData) {
        throw new Error(response?.data.message || "An unexpected error.");
      }
      return responseData;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateHiring: async (id: string, hiring: Hiring): Promise<void> => {
    console.log(hiring);

    try {
      const response: AxiosResponse<ApiResponse<void>> = await adminApi.put(
        API_ENDPOINTS.ADMIN.HIRING_UPDATE(id),
        hiring
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "An unexpected error.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  deleteHiring: async (id: string): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await adminApi.delete(
        API_ENDPOINTS.ADMIN.HIRING_DELETE(id)
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "An unexpected error.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateHiringStatus: async (
    id: string,
    status: HiringStatusEnum
  ): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await adminApi.patch(
        API_ENDPOINTS.ADMIN.HIRING_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "An unexpected error.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default hiringService;
