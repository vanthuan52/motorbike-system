import { AxiosError, AxiosResponse } from "axios";

import {
  HiringDetailResponse,
  HiringPaginationQuery,
  HiringResponse,
} from "./types";
import { publicApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";
import { mockHiringList } from "./mocks/hiring.mock";

const USE_MOCK = true;

const hiringService = {
  getHiringList: async (
    queries: HiringPaginationQuery
  ): Promise<HiringResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));

      let filtered = [...mockHiringList];

      if (queries.search) {
        const q = queries.search.toLowerCase();
        filtered = filtered.filter(
          (h) =>
            h.title.toLowerCase().includes(q) ||
            h.category.toLowerCase().includes(q)
        );
      }

      if (queries.status) {
        filtered = filtered.filter((h) => h.status === queries.status);
      }

      const page = queries.page || 1;
      const perPage = queries.perPage || 10;
      const total = filtered.length;
      const totalPage = Math.ceil(total / perPage);
      const paginated = filtered.slice((page - 1) * perPage, page * perPage);

      return {
        statusCode: 200,
        message: "Success",
        data: paginated as any,
        _metadata: {
          language: "vi",
          timestamp: Date.now(),
          timezone: "Asia/Ho_Chi_Minh",
          path: "/api/public/hiring",
          version: "1.0.0",
          pagination: {
            search: queries.search || "",
            availableSearch: ["title", "category"],
            page,
            perPage,
            orderBy: "createdAt",
            orderDirection: "desc",
            availableOrderBy: ["createdAt", "title"],
            availableOrderDirection: ["asc", "desc"],
            total,
            totalPage,
          },
        },
      };
    }

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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));

      const hiring = mockHiringList.find((h) => h.slug === slug);
      if (!hiring) throw new Error("Hiring not found");

      return {
        statusCode: 200,
        message: "Success",
        data: hiring as any,
      };
    }

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
