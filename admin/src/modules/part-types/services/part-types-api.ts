import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ENUM_PART_TYPE_STATUS,
  PartTypePaginationQuery,
  PartTypeListResponse,
  PartTypeDetailResponse,
  PartTypeCreationResponse,
  PartTypeUpdateResponse,
  PartTypeDeleteResponse,
  PartTypeUpdateStatusResponse,
} from "../types";
import { PartType } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const partTypesService = {
  getPartTypeList: async (
    queries?: PartTypePaginationQuery
  ): Promise<PartTypeListResponse> => {
    try {
      const response = await adminApi.get<PartTypeListResponse>(
        API_ENDPOINTS.ADMIN.PART_TYPES,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get PartType list failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  getPartTypeDetails: async (id: string): Promise<PartTypeDetailResponse> => {
    try {
      const response = await adminApi.get<PartTypeDetailResponse>(
        API_ENDPOINTS.ADMIN.PART_TYPE_DETAILS(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get PartType details failed."
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
  createPartType: async (
    PartType: PartType
  ): Promise<PartTypeCreationResponse> => {
    try {
      const response: AxiosResponse<PartTypeCreationResponse> =
        await adminApi.post(API_ENDPOINTS.ADMIN.PART_TYPE_CREATE, PartType);
      if (response.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Create PartType failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  updatePartType: async (
    id: string,
    PartType: PartType
  ): Promise<PartTypeUpdateResponse> => {
    try {
      const response = await adminApi.put<PartTypeUpdateResponse>(
        API_ENDPOINTS.ADMIN.PART_TYPE_UPDATE(id),
        PartType
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Update PartType failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  deletePartType: async (id: string): Promise<PartTypeDeleteResponse> => {
    try {
      const response = await adminApi.delete<PartTypeDeleteResponse>(
        API_ENDPOINTS.ADMIN.PART_TYPE_DELETE(id)
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Delete PartType failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  updatePartTypeStatus: async (
    id: string,
    status: ENUM_PART_TYPE_STATUS
  ): Promise<PartTypeUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<PartTypeUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.PART_TYPE_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update PartType status failed."
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

export default partTypesService;
