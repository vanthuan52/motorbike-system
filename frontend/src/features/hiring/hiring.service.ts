import { AxiosError, AxiosResponse } from "axios";
import {
  HiringDetailResponse,
  HiringPaginationQuery,
  HiringResponse,
} from "./types";
import { publicApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";

const hiringService = {
  getHiringList: async (
    queries: HiringPaginationQuery
  ): Promise<HiringResponse> => {
    try {
      const response: AxiosResponse<HiringResponse> = await publicApi.get(
        API_ENDPOINTS.PUBLIC.HIRING,
        {
          params: queries,
        }
      );
      const responseData: HiringResponse | undefined = response.data;
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

  getHiringDetails: async (slug: string): Promise<HiringDetailResponse> => {
    try {
      const response: AxiosResponse<HiringResponse> = await publicApi.get(
        API_ENDPOINTS.PUBLIC.HIRING_DETAILS(slug)
      );
      const responseData: HiringDetailResponse | undefined = response.data;

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

export default hiringService;
