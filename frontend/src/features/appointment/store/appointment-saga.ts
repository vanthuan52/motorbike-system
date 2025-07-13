import { notificationActions } from "@/features/notification/store/notification-slice";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { AppointmentsActions } from "./appointment-slice";
import { Appointments, AppointmentsCreationResponse } from "../types";
import AppointmentsService from "../appointments.service";

function* createAppointmentsHandler(
  action: PayloadAction<{ appointments: Appointments }>
) {
  try {
    const { appointments } = action.payload;
    const response: AppointmentsCreationResponse = yield call(
      AppointmentsService.create,
      appointments
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(AppointmentsActions.createAppointmentsSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(AppointmentsActions.createAppointmentsFailure(message));
  }
}

export function* AppointmentsSaga() {
  yield takeLatest(
    AppointmentsActions.createAppointments,
    createAppointmentsHandler
  );
}
