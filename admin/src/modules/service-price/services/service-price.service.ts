import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import {
  ServicePricePaginationQuery,
  ServicePriceListResponse,
  ServicePriceDetailResponse,
  ServicePriceCreationResponse,
  ServicePriceUpdateResponse,
  ServicePriceDeleteResponse,
  ModelServicePricePaginationQuery,
  ModelServicePriceListResponse,
} from "../types";
import { ServicePrice } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const servicePriceService = {
  getServicePriceList: async (
    queries?: ServicePricePaginationQuery
  ): Promise<ServicePriceListResponse> => {
    try {
      const response = await adminApi.get<ServicePriceListResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_PRICE_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get service price list failed."
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
  getServicePriceDetail: async (
    id: string
  ): Promise<ServicePriceDetailResponse> => {
    try {
      const response = await adminApi.get<ServicePriceDetailResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_PRICE_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get service price details failed."
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
  createServicePrice: async (
    ServicePrice: ServicePrice
  ): Promise<ServicePriceCreationResponse> => {
    try {
      const response: AxiosResponse<ServicePriceCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.SERVICE_PRICE_CREATE,
          ServicePrice
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(
          response.data.message || "Create service price failed."
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
  updateServicePrice: async (
    id: string,
    ServicePrice: ServicePrice
  ): Promise<ServicePriceUpdateResponse> => {
    try {
      const response = await adminApi.put<ServicePriceUpdateResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_PRICE_UPDATE(id),
        ServicePrice
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update service price failed."
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
  deleteServicePrice: async (
    id: string
  ): Promise<ServicePriceDeleteResponse> => {
    try {
      const response = await adminApi.delete<ServicePriceDeleteResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_PRICE_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Delete service price failed."
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

  getModelServicePriceList: async (
    vehicleServiceId: string,
    queries?: ModelServicePricePaginationQuery
  ): Promise<ModelServicePriceListResponse> => {
    try {
      const response = await adminApi.get<ModelServicePriceListResponse>(
        API_ENDPOINTS.ADMIN.MODEL_SERVICE_PRICE_LIST(vehicleServiceId),
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get service price list failed."
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

  getServicePriceHistoryList: async (
    vehicleServiceId: string,
    vehicleModelId: string
  ): Promise<ServicePriceListResponse> => {
    try {
      const response = await adminApi.get<ServicePriceListResponse>(
        API_ENDPOINTS.ADMIN.SERVICE_PRICE_HISTORY_LIST(
          vehicleServiceId,
          vehicleModelId
        )
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get service price list failed."
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

export default servicePriceService;
