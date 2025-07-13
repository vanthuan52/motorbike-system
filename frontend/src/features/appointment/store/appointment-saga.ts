import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { appointmentActions } from "./appointment-slice";
import { Appointment, AppointmentsCreationResponse } from "../types";
import { notificationActions } from "@/features/notification/store/notification-slice";
import appointmentsService from "../appointments.service";

function* createAppointmentHandler(
  action: PayloadAction<{ appointment: Appointment }>
) {
  try {
    const { appointment } = action.payload;
    const response: AppointmentsCreationResponse = yield call(
      appointmentsService.create,
      appointment
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(appointmentActions.createAppointmentSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(appointmentActions.createAppointmentFailure(message));
  }
}

export function* appointmentSaga() {
  yield takeLatest(
    appointmentActions.createAppointment,
    createAppointmentHandler
  );
}
