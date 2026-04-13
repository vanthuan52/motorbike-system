import { AxiosError } from "axios";

import { publicApi } from "@/lib/axios";
import {
  VehicleServicePaginationQuery,
  VehicleServiceListResponse,
  VehicleServiceDetailResponse,
} from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { mockVehicleServices } from "./mocks/vehicle-service.mock";

/**
 * Toggle this flag to switch between mock data and real API.
 * When backend is ready, simply set USE_MOCK = false.
 */
const USE_MOCK = true;

const vehicleServiceService = {
  getVehicleServiceList: async (
    queries?: VehicleServicePaginationQuery
  ): Promise<VehicleServiceListResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 250));
      return {
        statusCode: 200,
        message: "Success",
        data: mockVehicleServices,
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
            total: mockVehicleServices.length,
            totalPage: 1,
          },
        },
      };
    }

    try {
      const response = await publicApi.get<VehicleServiceListResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_SERVICE_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle service list failed."
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
  getVehicleServiceDetail: async (
    slug: string
  ): Promise<VehicleServiceDetailResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 150));
      const service = mockVehicleServices.find((s) => s.slug === slug);
      if (!service) throw new Error("Vehicle service not found.");
      return {
        statusCode: 200,
        message: "Success",
        data: service,
      };
    }

    try {
      const response = await publicApi.get<VehicleServiceDetailResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_SERVICE_DETAIL(slug)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle Service details failed."
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

export default vehicleServiceService;

