import { AxiosError } from "axios";
import { adminApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoint";
import { ApiErrorResponse } from "@/types/api.type";
import {
  CandidatePaginationQuery,
  CandidateListResponse,
  CandidateDetailResponse,
  CandidateUpdateStatusResponse,
  ENUM_CANDIDATE_STATUS,
} from "./types";

const candidateService = {
  getCandidates: async (
    queries?: CandidatePaginationQuery
  ): Promise<CandidateListResponse> => {
    try {
      const response = await adminApi.get<CandidateListResponse>(
        API_ENDPOINTS.ADMIN.CANDIDATE_LIST,
        {
          params: queries,
        }
      );

      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Lấy danh sách ứng viên thất bại."
        );
      }

      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message ||
          "Lỗi không xác định khi lấy danh sách ứng viên."
      );
    }
  },

  getCandidateDetail: async (id: string): Promise<CandidateDetailResponse> => {
    try {
      const response = await adminApi.get<CandidateDetailResponse>(
        API_ENDPOINTS.ADMIN.CANDIDATE_DETAILS(id)
      );

      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Lấy chi tiết ứng viên thất bại."
        );
      }

      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message ||
          "Lỗi không xác định khi lấy chi tiết ứng viên."
      );
    }
  },

  updateCandidateStatus: async (
    id: string,
    status: ENUM_CANDIDATE_STATUS
  ): Promise<CandidateUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<CandidateUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.CANDIDATE_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Cập nhật trạng thái thất bại."
        );
      }

      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message ||
          "Lỗi không xác định khi cập nhật trạng thái."
      );
    }
  },
};

export default candidateService;
