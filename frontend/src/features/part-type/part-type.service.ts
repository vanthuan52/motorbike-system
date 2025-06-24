import { AxiosError, AxiosResponse } from "axios";
import {
  PartTypeDetailResponse,
  PartTypeListResponse,
  PartTypePaginationQuery,
} from "./types";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { publicApi, userApi } from "@/lib/axios";
import { ApiErrorResponse } from "@/types/api.type";

const partTypeServices = {
  getPartTypes: async (
    queries?: PartTypePaginationQuery
  ): Promise<PartTypeListResponse> => {
    try {
      const response: AxiosResponse<PartTypeListResponse> = await publicApi.get(
        API_ENDPOINTS.PUBLIC.PART_TYPES,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response?.data.message || "Get part type list failed.");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  getPartTypeDetail: async (slug: string): Promise<PartTypeDetailResponse> => {
    try {
      const response: AxiosResponse<PartTypeDetailResponse> =
        await publicApi.get(API_ENDPOINTS.PUBLIC.PART_TYPE_DETAIL(slug));
      if (response.status !== 200 || !response.data.data) {
        throw new Error(response?.data.message || "Get part type failed.");
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

export default partTypeServices;
