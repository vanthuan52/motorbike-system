import { AxiosError } from "axios";
import { publicApi } from "@/lib/axios";
import {
  ServiceCategoryPaginationQuery,
  ServiceCategoryListResponse,
  ServiceCategoryDetailResponse,
} from "../types";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";

const serviceCategoryService = {
  getServiceCategoryList: async (
    queries?: ServiceCategoryPaginationQuery
  ): Promise<ServiceCategoryListResponse> => {
    try {
      const response = await publicApi.get<ServiceCategoryListResponse>(
        API_ENDPOINTS.PUBLIC.SERVICE_CATEGORY_LIST,
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
      const response = await publicApi.get<ServiceCategoryDetailResponse>(
        API_ENDPOINTS.PUBLIC.SERVICE_CATEGORY_DETAIL(id)
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
};

export default serviceCategoryService;
