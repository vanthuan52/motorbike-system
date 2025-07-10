import { AxiosError, AxiosResponse } from "axios";
import { publicApi } from "@/lib/axios";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import {
  MaintenanceSchedule,
  MaintenanceScheduleCreationResponse,
} from "./types";

const maintenanceScheduleService = {
  create: async (
    data: MaintenanceSchedule
  ): Promise<MaintenanceScheduleCreationResponse> => {
    try {
      const response: AxiosResponse<MaintenanceScheduleCreationResponse> =
        await publicApi.post(
          API_ENDPOINTS.PUBLIC.CREATE_MAINTENANCE_SCHEDULE,
          data
        );
      if (response.status !== 201 || !response.data.data) {
        throw new Error(
          response.data.message || "Create maintenance schedule failed."
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

export default maintenanceScheduleService;
