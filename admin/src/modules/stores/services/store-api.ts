import { adminApi } from "@/lib/axios";
import {
  ENUM_STORE_STATUS,
  Store,
  StoreCreationResponse,
  StoreDeleteResponse,
  StoreDetailResponse,
  StoreListResponse,
  StorePaginationQuery,
  StoreUpdateResponse,
  StoreUpdateStatusResponse,
} from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { AxiosError, AxiosResponse } from "axios";
import { ApiErrorResponse } from "@/types/api.type";

const storeService = {
  getStoreList: async (
    queries?: StorePaginationQuery
  ): Promise<StoreListResponse> => {
    try {
      const response = await adminApi.get<StoreListResponse>(
        API_ENDPOINTS.ADMIN.STORE_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get store list failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  getStoreDetails: async (id: string): Promise<StoreDetailResponse> => {
    try {
      const response = await adminApi.get<StoreDetailResponse>(
        API_ENDPOINTS.ADMIN.STORE_DETAILS(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response.data.message || "Get store details failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  createStore: async (Store: Store): Promise<StoreCreationResponse> => {
    try {
      const response: AxiosResponse<StoreCreationResponse> =
        await adminApi.post(API_ENDPOINTS.ADMIN.STORE_CREATE, Store);
      if (response.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Create store failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateStore: async (
    id: string,
    Store: Store
  ): Promise<StoreUpdateResponse> => {
    try {
      const response = await adminApi.put<StoreUpdateResponse>(
        API_ENDPOINTS.ADMIN.STORE_UPDATE(id),
        Store
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Update store failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  deleteStore: async (id: string): Promise<StoreDeleteResponse> => {
    try {
      const response = await adminApi.delete<StoreDeleteResponse>(
        API_ENDPOINTS.ADMIN.STORE_DELETE(id)
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Delete store failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  updateStoreStatus: async (
    id: string,
    status: ENUM_STORE_STATUS
  ): Promise<StoreUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<StoreUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.STORE_UPDATE_STATUS(id),
        { status }
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Update store status failed.");
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

export default storeService;
