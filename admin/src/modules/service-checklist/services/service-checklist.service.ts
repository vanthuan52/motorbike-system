import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ServiceChecklistPaginationQuery,
  ServiceChecklistListResponse,
  ServiceChecklistDetailResponse,
  ServiceChecklistCreationResponse,
  ServiceChecklistUpdateResponse,
  ServiceChecklistDeleteResponse,
} from "../types";
import { ServiceChecklist } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const ServiceChecklistService = {
  getServiceChecklistList: async (
    queries?: ServiceChecklistPaginationQuery
  ): Promise<ServiceChecklistListResponse> => {
    try {
      const response = await adminApi.get<ServiceChecklistListResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CHECKLIST_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get service checklist list failed."
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
  getServiceChecklistDetail: async (
    id: string
  ): Promise<ServiceChecklistDetailResponse> => {
    try {
      const response = await adminApi.get<ServiceChecklistDetailResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CHECKLIST_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get service checklist details failed."
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
  createServiceChecklist: async (
    serviceChecklist: ServiceChecklist
  ): Promise<ServiceChecklistCreationResponse> => {
    try {
      const response: AxiosResponse<ServiceChecklistCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.SERVICE_CHECKLIST_CREATE,
          serviceChecklist
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(
          response.data.message || "Create service checklist failed."
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
  updateServiceChecklist: async (
    id: string,
    serviceChecklist: ServiceChecklist
  ): Promise<ServiceChecklistUpdateResponse> => {
    try {
      const response = await adminApi.put<ServiceChecklistUpdateResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CHECKLIST_UPDATE(id),
        serviceChecklist
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update service checklist failed."
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
  deleteServiceChecklist: async (
    id: string
  ): Promise<ServiceChecklistDeleteResponse> => {
    try {
      const response = await adminApi.delete<ServiceChecklistDeleteResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CHECKLIST_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Delete service category failed."
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

export default ServiceChecklistService;
