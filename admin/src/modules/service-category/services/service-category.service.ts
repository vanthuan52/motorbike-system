import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ENUM_SERVICE_CATEGORY_STATUS,
  ServiceCategoryPaginationQuery,
  ServiceCategoryListResponse,
  ServiceCategoryDetailResponse,
  ServiceCategoryCreationResponse,
  ServiceCategoryUpdateResponse,
  ServiceCategoryDeleteResponse,
  ServiceCategoryUpdateStatusResponse,
} from "../types";
import { ServiceCategory } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const serviceCategoryService = {
  getServiceCategoryList: async (
    queries?: ServiceCategoryPaginationQuery
  ): Promise<ServiceCategoryListResponse> => {
    try {
      const response = await adminApi.get<ServiceCategoryListResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CATEGORY_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get serviceCategory list failed."
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
  getServiceCategoryDetails: async (
    id: string
  ): Promise<ServiceCategoryDetailResponse> => {
    try {
      const response = await adminApi.get<ServiceCategoryDetailResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CATEGORY_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get service category details failed."
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
  createServiceCategory: async (
    ServiceCategory: ServiceCategory
  ): Promise<ServiceCategoryCreationResponse> => {
    try {
      const response: AxiosResponse<ServiceCategoryCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.SERVICE_CATEGORY_CREATE,
          ServiceCategory
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(
          response.data.message || "Create service category failed."
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
  updateServiceCategory: async (
    id: string,
    serviceCategory: ServiceCategory
  ): Promise<ServiceCategoryUpdateResponse> => {
    try {
      const response = await adminApi.put<ServiceCategoryUpdateResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CATEGORY_UPDATE(id),
        serviceCategory
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update service category failed."
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
  deleteServiceCategory: async (
    id: string
  ): Promise<ServiceCategoryDeleteResponse> => {
    try {
      const response = await adminApi.delete<ServiceCategoryDeleteResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_CATEGORY_DELETION(id)
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
  updateServiceCategoryStatus: async (
    id: string,
    status: ENUM_SERVICE_CATEGORY_STATUS
  ): Promise<ServiceCategoryUpdateStatusResponse> => {
    try {
      const response =
        await adminApi.patch<ServiceCategoryUpdateStatusResponse>(
          API_ENDPOINTS.ADMIN.SERVICE_CATEGORY_UPDATE_STATUS(id),
          { status }
        );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update service category status failed."
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

export default serviceCategoryService;
