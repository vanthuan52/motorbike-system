import { AxiosError, AxiosResponse } from "axios";
import {
  ENUM_PART_TYPE_STATUS,
  Order,
  PartTypeResponse,
  PartTypeResponseData,
} from "./types";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { userApi } from "@/lib/axios";
import { ApiErrorResponse } from "@/types/api.type";

type CategoryFilter = {
  search?: string;
  page?: number;
  perPage?: number;
  status?: ENUM_PART_TYPE_STATUS;
  orderBy?: Order["orderBy"];
  orderDirection?: Order["orderDirection"];
};

const categoriesService = {
  getCategoryList: async (
    filter?: CategoryFilter
  ): Promise<PartTypeResponse> => {
    try {
      const response: AxiosResponse<PartTypeResponse> = await userApi.get(
        API_ENDPOINTS.PUBLIC.CATEGORIES,
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
      const response: AxiosResponse<PartTypeResponse> = await userApi.get(
        API_ENDPOINTS.PUBLIC.CATEGORY_DETAILS(id)
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
};

export default categoriesService;
