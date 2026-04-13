import { AxiosError } from "axios";

import { publicApi } from "@/lib/axios";
import {
  VehicleModelPaginationQuery,
  VehicleModelListResponse,
  VehicleModelDetailResponse,
} from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { mockVehicleModels } from "./mocks/vehicle-model.mock";

/**
 * Toggle this flag to switch between mock data and real API.
 * When backend is ready, simply set USE_MOCK = false.
 */
const USE_MOCK = true;

const vehicleModelService = {
  getVehicleModelList: async (
    queries?: VehicleModelPaginationQuery
  ): Promise<VehicleModelListResponse> => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 300));

      let data = [...mockVehicleModels];

      // Apply brand filter if provided
      if (queries?.vehicleBrand) {
        data = data.filter(
          (m) => m.vehicleBrand._id === queries.vehicleBrand
        );
      }

      return {
        statusCode: 200,
        message: "Success",
        data,
        _metadata: {
          language: "vi",
          timestamp: Date.now(),
          timezone: "Asia/Ho_Chi_Minh",
          path: "",
          version: "1",
          pagination: {
            search: "",
            availableSearch: ["name"],
            page: queries?.page ?? 1,
            perPage: queries?.perPage ?? 100,
            orderBy: "createdAt",
            orderDirection: "desc",
            availableOrderBy: ["createdAt"],
            availableOrderDirection: ["asc", "desc"],
            total: data.length,
            totalPage: 1,
          },
        },
      };
    }

    try {
      const response = await publicApi.get<VehicleModelListResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_MODEL_LIST,
        {
          params: queries,
        }
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle model list failed."
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
  getVehicleModelDetail: async (
    slug: string
  ): Promise<VehicleModelDetailResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));

      const model = mockVehicleModels.find((m) => m.slug === slug);
      if (!model) {
        throw new Error("Vehicle model not found.");
      }
      return {
        statusCode: 200,
        message: "Success",
        data: model,
      };
    }

    try {
      const response = await publicApi.get<VehicleModelDetailResponse>(
        API_ENDPOINTS.PUBLIC.VEHICLE_MODEL_DETAIL(slug)
      );
      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get vehicle model details failed."
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

export default vehicleModelService;

