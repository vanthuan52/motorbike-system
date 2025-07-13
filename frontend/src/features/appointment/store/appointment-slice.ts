import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApiState } from "@/types/redux-common.type";
import { Appointments } from "../types";

interface AppointmentsState extends BaseApiState {
  error: string | null;
}

const initialState: AppointmentsState = {
  create: { loading: false, success: false },
  error: null,
  loadingList: false,
  loadingSingle: false,
  update: { loading: false, success: false },
  deletion: { loading: false, success: false },
  partialUpdate: { loading: false, success: false },
};

export const AppointmentsSlice = createSlice({
  name: "Appointments",
  initialState,
  reducers: {
    createAppointments(
      state,
      action: PayloadAction<{ appointments: Appointments }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createAppointmentsSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createAppointmentsFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },
    resetCreateAppointments(state) {
      state.create = { loading: false, success: false };
      state.error = null;
    },
  },
});

export const AppointmentsActions = AppointmentsSlice.actions;
export default AppointmentsSlice.reducer;
