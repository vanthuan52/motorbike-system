import { notificationActions } from "@/features/notification/store/notification-slice";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { maintenanceScheduleActions } from "./maintenance-schedule-slice";
import {
  MaintenanceSchedule,
  MaintenanceScheduleCreationResponse,
} from "../types";
import maintenanceScheduleService from "../maintenance-schedule.service";

function* createMaintenanceScheduleHandler(
  action: PayloadAction<{ maintenanceSchedule: MaintenanceSchedule }>
) {
  try {
    const { maintenanceSchedule } = action.payload;
    const response: MaintenanceScheduleCreationResponse = yield call(
      maintenanceScheduleService.create,
      maintenanceSchedule
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(maintenanceScheduleActions.createMaintenanceScheduleSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(
      maintenanceScheduleActions.createMaintenanceScheduleFailure(message)
    );
  }
}

export function* maintenanceScheduleSaga() {
  yield takeLatest(
    maintenanceScheduleActions.createMaintenanceSchedule,
    createMaintenanceScheduleHandler
  );
}
