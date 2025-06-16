import { AxiosError, AxiosResponse } from "axios";
import { adminApi } from "@/lib/axios";
import { Order, PartTypeResponse, PartTypeResponseData, PartTypeStatus } from "../types";
import { Category } from "../types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse, ApiResponse } from "@/types/api.type";

type CategoryFilter = {
  search?: string;
  page?: number;
  perPage?: number;
  status?: PartTypeStatus;
  orderBy?: Order["orderBy"];
  orderDirection?: Order["orderDirection"];
};
const categoriesService = {
  getCategoryList: async (
    filter?: CategoryFilter
  ): Promise<PartTypeResponse> => {
    try {
      const response: AxiosResponse<PartTypeResponse> = await adminApi.get(
        API_ENDPOINTS.ADMIN.CATEGORIES,
        {
          params: {
            search: filter?.search || "",
            page: filter?.page || 1,
            perPage: filter?.perPage || 10,
            status: filter?.status || "",
          },
        }
      );
      const responseData: PartTypeResponse | undefined = response.data;
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
  getCategoryDetails: async (id: string): Promise<PartTypeResponseData> => {
    try {
      const response: AxiosResponse<PartTypeResponse> = await adminApi.get(
        API_ENDPOINTS.ADMIN.CATEGORY_DETAILS(id)
      );
      const responseData: PartTypeResponseData | undefined = response.data.data;
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
  createCategory: async (category: Category): Promise<PartTypeResponseData> => {
    try {
      const response: AxiosResponse<PartTypeResponse> = await adminApi.post(
        API_ENDPOINTS.ADMIN.CATEGORY_CREATE,
        category
      );
      const responseData: PartTypeResponseData | undefined = response.data.data;
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
  updateCategory: async (id: string, category: Category): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await adminApi.put(
        API_ENDPOINTS.ADMIN.CATEGORY_UPDATE(id),
        category
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
  deleteCategory: async (
    id: string
  ): Promise<void> =>{
    try {
      const response: AxiosResponse<ApiResponse<void>> = await adminApi.delete(
        API_ENDPOINTS.ADMIN.CATEGORY_DELETE(id)
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
  updateCategoryStatus: async (
    id: string,
    status: PartTypeStatus
  ): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await adminApi.patch(
        API_ENDPOINTS.ADMIN.CATEGORY_UPDATE_STATUS(id),
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

export default categoriesService;
