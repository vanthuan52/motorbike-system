import { AxiosError, AxiosResponse } from "axios";
import { publicApi } from "@/lib/axios";
import { ApiErrorResponse } from "@/types/api.type";
import { API_ENDPOINTS } from "@/constant/api-endpoint";
import { Appointment, AppointmentsCreationResponse } from "./types";

const appointmentService = {
  create: async (data: Appointment): Promise<AppointmentsCreationResponse> => {
    try {
      const response: AxiosResponse<AppointmentsCreationResponse> =
        await publicApi.post(API_ENDPOINTS.PUBLIC.CREATE_APPOINTMENT, data);
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

export default appointmentService;
