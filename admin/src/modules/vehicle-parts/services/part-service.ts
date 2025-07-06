import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ENUM_PART_STATUS,
  PartPaginationQuery,
  PartListResponse,
  PartDetailResponse,
  PartCreationResponse,
  PartUpdateResponse,
  PartDeleteResponse,
  PartUpdateStatusResponse,
} from "../types";
import { VehiclePart } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const partsService = {
  getPartList: async (
    queries?: PartPaginationQuery
  ): Promise<PartListResponse> => {
    try {
      const response = await adminApi.get<PartListResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_PART_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get Part list failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  getPartDetails: async (id: string): Promise<PartDetailResponse> => {
    try {
      const response = await adminApi.get<PartDetailResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_PART_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get Part details failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  createPart: async (Part: VehiclePart): Promise<PartCreationResponse> => {
    try {
      const response: AxiosResponse<PartCreationResponse> = await adminApi.post(
        API_ENDPOINTS.ADMIN.VEHICLE_PART_CREATE,
        Part
      );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Create Part failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  updatePart: async (
    id: string,
    Part: VehiclePart
  ): Promise<PartUpdateResponse> => {
    try {
      const response = await adminApi.put<PartUpdateResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_PART_UPDATE(id),
        Part
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Update Part failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  deletePart: async (id: string): Promise<PartDeleteResponse> => {
    try {
      const response = await adminApi.delete<PartDeleteResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_PART_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Delete Part failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  updatePartStatus: async (
    id: string,
    status: ENUM_PART_STATUS
  ): Promise<PartUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<PartUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.VEHICLE_PART_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Update Part status failed.");
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

export default partsService;
