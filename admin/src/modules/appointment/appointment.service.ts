import { AxiosError, AxiosResponse } from "axios";

import {
  Appointments,
  AppointmentsPaginationQuery,
  AppointmentsListResponse,
  AppointmentsDetailResponse,
  AppointmentsCreationResponse,
  AppointmentsUpdateResponse,
  AppointmentsDeleteResponse,
  AppointmentsUpdateStatusResponse,
  ENUM_APPOINTMENTS_STATUS,
} from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { adminApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoint";

export const AppointmentsService = {
  getAppointmentsList: async (
    queries?: AppointmentsPaginationQuery
  ): Promise<AppointmentsListResponse> => {
    try {
      const response = await adminApi.get<AppointmentsListResponse>(
        API_ENDPOINTS.ADMIN.APPOINTMENTS_LIST,
        { params: queries }
      );

      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get maintenance schedule list failed."
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

  getAppointmentDetails: async (
    id: string
  ): Promise<AppointmentsDetailResponse> => {
    try {
      const response = await adminApi.get<AppointmentsDetailResponse>(
        API_ENDPOINTS.ADMIN.APPOINTMENTS_DETAIL(id)
      );

      if (response.status !== 200 || !response.data.data) {
        throw new Error(
          response.data.message || "Get maintenance schedule detail failed."
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

  createAppointment: async (
    Appointment: Appointments
  ): Promise<AppointmentsCreationResponse> => {
    try {
      const response: AxiosResponse<AppointmentsCreationResponse> =
        await adminApi.post(
          API_ENDPOINTS.ADMIN.APPOINTMENTS_CREATE,
          Appointment
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

  updateAppointment: async (
    id: string,
    appointment: Appointments
  ): Promise<AppointmentsUpdateResponse> => {
    try {
      const response = await adminApi.put<AppointmentsUpdateResponse>(
        API_ENDPOINTS.ADMIN.APPOINTMENTS_UPDATE(id),
        appointment
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update maintenance schedule failed."
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

  deleteAppointment: async (
    id: string
  ): Promise<AppointmentsDeleteResponse> => {
    try {
      const response = await adminApi.delete<AppointmentsDeleteResponse>(
        API_ENDPOINTS.ADMIN.APPOINTMENTS_DELETION(id)
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Delete maintenance schedule failed."
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

  updateAppointmentStatus: async (
    id: string,
    status: ENUM_APPOINTMENTS_STATUS
  ): Promise<AppointmentsUpdateStatusResponse> => {
    try {
      const response = await adminApi.patch<AppointmentsUpdateStatusResponse>(
        API_ENDPOINTS.ADMIN.APPOINTMENTS_UPDATE_STATUS(id),
        { status }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Update maintenance schedule status failed."
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
