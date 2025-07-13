import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApiState } from "@/types/redux-common.type";
import { Appointment } from "../types";

interface AppointmentState extends BaseApiState {
  error: string | null;
}

const initialState: AppointmentState = {
  create: { loading: false, success: false },
  error: null,
  loadingList: false,
  loadingSingle: false,
  update: { loading: false, success: false },
  deletion: { loading: false, success: false },
  partialUpdate: { loading: false, success: false },
};

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    createAppointment(
      state,
      action: PayloadAction<{ appointment: Appointment }>
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
    resetCreateAppointment(state) {
      state.create = { loading: false, success: false };
      state.error = null;
    },
  },
});

export const appointmentActions = appointmentSlice.actions;
export default appointmentSlice.reducer;
