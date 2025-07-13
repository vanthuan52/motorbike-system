import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  Appointments,
  AppointmentsPaginationQuery,
  ENUM_APPOINTMENTS_STATUS,
} from "../types";

interface AppointmentsState extends BaseApiState {
  list: Appointments[];
  detail: Appointments | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetAppointmentsSuccessPayload {
  list: Appointments[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: AppointmentsState = {
  list: [],
  detail: null,
  loadingList: false,
  loadingSingle: false,
  create: { loading: false, success: false },
  update: { loading: false, success: false },
  deletion: { loading: false, success: false },
  partialUpdate: { loading: false, success: false },
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
};

export const AppointmentsSlice = createSlice({
  name: "Appointments",
  initialState,
  reducers: {
    getAppointments(state, action: PayloadAction<AppointmentsPaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getAppointmentsSuccess(
      state,
      action: PayloadAction<GetAppointmentsSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getAppointmentsFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getAppointmentDetail(
      state,
      action: PayloadAction<{ appointmentId: string }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getAppointmentDetailSuccess(state, action: PayloadAction<Appointments>) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getAppointmentDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    createAppointment(
      state,
      action: PayloadAction<{ Appointments: Appointments }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createAppointmentSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createAppointmentFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateAppointment(
      state,
      action: PayloadAction<{
        appointmentId: string;
        appointment: Appointments;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateAppointmentSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateAppointmentFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteAppointment(state, action: PayloadAction<{ appointmentId: string }>) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteAppointmentSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteAppointmentFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    updateAppointmentStatus(
      state,
      action: PayloadAction<{
        appointmentId: string;
        status: ENUM_APPOINTMENTS_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateAppointmentStatusSuccess(
      state,
      action: PayloadAction<{
        appointmentId: string;
        status: ENUM_APPOINTMENTS_STATUS;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
    },
    updateAppointmentStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    resetAppointmentDetail(state) {
      state.loadingSingle = false;
      state.detail = null;
      state.error = null;
    },

    resetState(state) {
      state.create = { loading: false, success: false };
      state.update = { loading: false, success: false };
      state.deletion = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
      state.loadingList = false;
      state.loadingSingle = false;
      state.list = [];
      state.detail = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const AppointmentsActions = AppointmentsSlice.actions;
export default AppointmentsSlice.reducer;
