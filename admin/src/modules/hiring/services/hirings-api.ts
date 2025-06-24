import { AxiosError, AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";
import { adminApi } from "@/lib/axios";
import {
  ENUM_HIRING_STATUS,
  Hiring,
  HiringCreationResponse,
  HiringDeleteResponse,
  HiringDetailResponse,
  HiringListResponse,
  HiringPaginationQuery,
  HiringUpdateResponse,
  HiringUpdateStatusResponse,
} from "../types";

const hiringService = {
  getHiringList: async (
    queries?: HiringPaginationQuery
  ): Promise<HiringListResponse> => {
    try {
      const response = await adminApi.get<HiringListResponse>(
        API_ENDPOINTS.ADMIN.HIRING,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get hiring list failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  getHiringDetails: async (id: string): Promise<HiringDetailResponse> => {
    try {
      const response: AxiosResponse<HiringDetailResponse> = await adminApi.get(
        API_ENDPOINTS.ADMIN.HIRING_DETAILS(id)
      );

      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get hiring details failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  createHiring: async (hiring: Hiring): Promise<HiringCreationResponse> => {
    try {
      const response: AxiosResponse<HiringCreationResponse> =
        await adminApi.post(API_ENDPOINTS.ADMIN.HIRING_CREATE, hiring);

      if (response.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Create hiring failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateHiring: async (
    id: string,
    hiring: Hiring
  ): Promise<HiringUpdateResponse> => {
    try {
      const response = await adminApi.put<HiringUpdateResponse>(
        API_ENDPOINTS.ADMIN.HIRING_UPDATE(id),
        hiring
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Update hiring failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  deleteHiring: async (id: string): Promise<HiringDeleteResponse> => {
    try {
      const response = await adminApi.delete<HiringDeleteResponse>(
        API_ENDPOINTS.ADMIN.HIRING_DELETE(id)
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Delete hiring failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateHiringStatus: async (
    id: string,
    status: ENUM_HIRING_STATUS
  ): Promise<HiringUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<HiringUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.HIRING_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update hiring status failed."
        );
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default hiringService;
