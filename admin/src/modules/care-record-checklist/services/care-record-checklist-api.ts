import { adminApi } from "@/lib/axios";
import {
  ENUM_CARE_RECORD_CHECKLIST_STATUS,
  CareRecordChecklist,
  CareRecordChecklistCreationResponse,
  CareRecordChecklistDeleteResponse,
  CareRecordChecklistDetailResponse,
  CareRecordChecklistListResponse,
  CareRecordChecklistPaginationQuery,
  CareRecordChecklistUpdateResponse,
  CareRecordChecklistUpdateStatusResponse,
} from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { AxiosError, AxiosResponse } from "axios";
import { ApiErrorResponse } from "@/types/api.type";

const CareRecordChecklistService = {
  getCareRecordChecklistList: async (
    queries?: CareRecordChecklistPaginationQuery
  ): Promise<CareRecordChecklistListResponse> => {
    try {
      const response = await adminApi.get<CareRecordChecklistListResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_CHECKLIST_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get Care Record list failed."
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

  getCareRecordChecklistDetails: async (
    id: string
  ): Promise<CareRecordChecklistDetailResponse> => {
    try {
      const response = await adminApi.get<CareRecordChecklistDetailResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_CHECKLIST_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get Care Record details failed."
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

  createCareRecordChecklist: async (
    CareRecordChecklist: CareRecordChecklist
  ): Promise<CareRecordChecklistCreationResponse> => {
    try {
      const response: AxiosResponse<CareRecordChecklistCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.CARE_RECORD_CHECKLIST_CREATE,
          CareRecordChecklist
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Create Care Record failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateCareRecordChecklist: async (
    id: string,
    CareRecordChecklist: CareRecordChecklist
  ): Promise<CareRecordChecklistUpdateResponse> => {
    try {
      const response = await adminApi.put<CareRecordChecklistUpdateResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_CHECKLIST_UPDATE(id),
        CareRecordChecklist
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Update Care Record failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  deleteCareRecordChecklist: async (
    id: string
  ): Promise<CareRecordChecklistDeleteResponse> => {
    try {
      const response = await adminApi.delete<CareRecordChecklistDeleteResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_CHECKLIST_DELETION(id)
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Delete Care Record failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateCareRecordChecklistStatus: async (
    id: string,
    status: ENUM_CARE_RECORD_CHECKLIST_STATUS
  ): Promise<CareRecordChecklistUpdateStatusResponse> => {
    try {
      const response =
        await adminApi.patch<CareRecordChecklistUpdateStatusResponse>(
          API_ENDPOINTS.ADMIN.CARE_RECORD_CHECKLIST_UPDATE_STATUS(id),
          { status }
        );
      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update CareRecordChecklist status failed."
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

export default CareRecordChecklistService;
