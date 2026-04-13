import { AxiosError } from "axios";

import { publicApi } from "@/lib/axios";
import {
  VehicleBrandPaginationQuery,
  VehicleBrandListResponse,
  VehicleBrandDetailResponse,
} from "./types";
import { VehicleBrand } from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { mockVehicleBrands } from "@/features/vehicle-model/mocks/vehicle-model.mock";

/**
 * Toggle this flag to switch between mock data and real API.
 * When backend is ready, simply set USE_MOCK = false.
 */
const USE_MOCK = true;

const vehicleBrandService = {
  getVehicleBrandList: async (
    queries?: VehicleBrandPaginationQuery
  ): Promise<VehicleBrandListResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        statusCode: 200,
        message: "Success",
        data: mockVehicleBrands,
        _metadata: {
          language: "vi",
          timestamp: Date.now(),
          timezone: "Asia/Ho_Chi_Minh",
          path: "",
          version: "1",
          pagination: {
            search: queries?.search ?? "",
            availableSearch: ["name"],
            page: queries?.page ?? 1,
            perPage: queries?.perPage ?? 100,
            orderBy: "createdAt",
            orderDirection: "desc",
            availableOrderBy: ["createdAt"],
            availableOrderDirection: ["asc", "desc"],
            total: mockVehicleBrands.length,
            totalPage: 1,
          },
        },
      };
    }

    try {
      const response = await publicApi.get<VehicleBrandListResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_BRAND_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle brand list failed."
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
  getVehicleBrandDetail: async (
    id: string
  ): Promise<VehicleBrandDetailResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 150));
      const brand = mockVehicleBrands.find((b) => b._id === id);
      if (!brand) throw new Error("Vehicle brand not found.");
      return {
        statusCode: 200,
        message: "Success",
        data: brand,
      };
    }

    try {
      const response = await publicApi.get<VehicleBrandDetailResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_BRAND_DETAIL(id)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle brand details failed."
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

export default vehicleBrandService;

