import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApiState } from "@/types/redux-common.type";
import { MaintenanceSchedule } from "../types";

interface MaintenanceScheduleState extends BaseApiState {
  error: string | null;
}

const initialState: MaintenanceScheduleState = {
  create: { loading: false, success: false },
  error: null,
  loadingList: false,
  loadingSingle: false,
  update: { loading: false, success: false },
  deletion: { loading: false, success: false },
  partialUpdate: { loading: false, success: false },
};

export const maintenanceScheduleSlice = createSlice({
  name: "maintenanceSchedule",
  initialState,
  reducers: {
    createMaintenanceSchedule(
      state,
      action: PayloadAction<{ maintenanceSchedule: MaintenanceSchedule }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createMaintenanceScheduleSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createMaintenanceScheduleFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },
    resetCreateMaintenanceSchedule(state) {
      state.create = { loading: false, success: false };
      state.error = null;
    },
  },
});

export const maintenanceScheduleActions = maintenanceScheduleSlice.actions;
export default maintenanceScheduleSlice.reducer;
