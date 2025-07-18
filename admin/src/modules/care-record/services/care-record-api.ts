import { adminApi } from "@/lib/axios";
import {
  ENUM_CARE_RECORD_STATUS,
  CareRecord,
  CareRecordCreationResponse,
  CareRecordDeleteResponse,
  CareRecordDetailResponse,
  CareRecordListResponse,
  CareRecordPaginationQuery,
  CareRecordUpdateResponse,
  CareRecordUpdateStatusResponse,
} from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { AxiosError, AxiosResponse } from "axios";
import { ApiErrorResponse } from "@/types/api.type";

const CareRecordService = {
  getCareRecordList: async (
    queries?: CareRecordPaginationQuery
  ): Promise<CareRecordListResponse> => {
    try {
      const response = await adminApi.get<CareRecordListResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_LIST,
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

  getCareRecordDetails: async (
    id: string
  ): Promise<CareRecordDetailResponse> => {
    try {
      const response = await adminApi.get<CareRecordDetailResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_DETAIL(id)
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

  createCareRecord: async (
    CareRecord: CareRecord
  ): Promise<CareRecordCreationResponse> => {
    try {
      const response: AxiosResponse<CareRecordCreationResponse> =
        await adminApi.post(API_ENDPOINTS.ADMIN.CARE_RECORD_CREATE, CareRecord);
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

  updateCareRecord: async (
    id: string,
    CareRecord: CareRecord
  ): Promise<CareRecordUpdateResponse> => {
    try {
      const response = await adminApi.put<CareRecordUpdateResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_UPDATE(id),
        CareRecord
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

  deleteCareRecord: async (id: string): Promise<CareRecordDeleteResponse> => {
    try {
      const response = await adminApi.delete<CareRecordDeleteResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_DELETION(id)
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

  updateCareRecordStatus: async (
    id: string,
    status: ENUM_CARE_RECORD_STATUS
  ): Promise<CareRecordUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<CareRecordUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.CARE_RECORD_UPDATE_STATUS(id),
        { status }
      );
      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update CareRecord status failed."
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
  updateCareRecordPaymentStatus: async (id: string, paymentStatus: string) => {
    try {
      const response = await adminApi.patch(
        API_ENDPOINTS.ADMIN.CARE_RECORD_UPDATE_PAYMENT_STATUS(id),
        { paymentStatus }
      );
      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update CareRecord payment status failed."
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
  assignCareRecordTechnician: async (id: string, technician: string) => {
    try {
      const response = await adminApi.patch(
        API_ENDPOINTS.ADMIN.CARE_RECORD_ASSIGN_TECHNICIAN(id),
        { technician }
      );
      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Assign Technician to Care Record failed."
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

export default CareRecordService;
