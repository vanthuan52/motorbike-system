import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, take, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { AppointmentsActions } from "./appointment-slice";
import {
  Appointments,
  ENUM_APPOINTMENTS_STATUS,
  AppointmentsListResponse,
  AppointmentsDetailResponse,
  AppointmentsCreationResponse,
  AppointmentsUpdateResponse,
  AppointmentsDeleteResponse,
  AppointmentsUpdateStatusResponse,
  AppointmentsPaginationQuery,
} from "../types";
import { AppointmentsService } from "../appointment.service";

function* getAppointmentsListHandler(
  action: PayloadAction<AppointmentsPaginationQuery>
) {
  try {
    const response: AppointmentsListResponse = yield call(
      AppointmentsService.getAppointmentsList,
      action.payload
    );
    const list = response.data;
    const pagination = response?._metadata?.pagination;

    yield put(
      AppointmentsActions.getAppointmentsSuccess({
        list: list ?? [],
        pagination,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách lịch bảo dưỡng thất bại!";
    yield put(AppointmentsActions.getAppointmentsFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getAppointmentsDetailHandler(
  action: PayloadAction<{ appointmentId: string }>
) {
  try {
    const { appointmentId } = action.payload;
    const response: AppointmentsDetailResponse = yield call(
      AppointmentsService.getAppointmentDetails,
      appointmentId
    );
    yield put(AppointmentsActions.getAppointmentDetailSuccess(response.data!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết lịch bảo dưỡng thất bại!";
    yield put(AppointmentsActions.getAppointmentDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createAppointmentsHandler(
  action: PayloadAction<{ Appointments: Appointments }>
) {
  try {
    const { Appointments } = action.payload;
    const response: AppointmentsCreationResponse = yield call(
      AppointmentsService.createAppointment,
      Appointments
    );
    yield put(AppointmentsActions.createAppointmentSuccess());
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(AppointmentsActions.createAppointmentFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* updateAppointmentsHandler(
  action: PayloadAction<{
    appointmentId: string;
    appointment: Appointments;
  }>
) {
  try {
    const { appointmentId, appointment } = action.payload;
    const response: AppointmentsUpdateResponse = yield call(
      AppointmentsService.updateAppointment,
      appointmentId,
      appointment
    );
    yield put(AppointmentsActions.updateAppointmentSuccess());
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );

    yield put(
      AppointmentsActions.getAppointmentDetail({
        appointmentId,
      })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(AppointmentsActions.updateAppointmentFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* deleteAppointmentsHandler(
  action: PayloadAction<{ appointmentId: string }>
) {
  try {
    const { appointmentId } = action.payload;
    const response: AppointmentsDeleteResponse = yield call(
      AppointmentsService.deleteAppointment,
      appointmentId
    );
    yield put(AppointmentsActions.deleteAppointmentSuccess());
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(AppointmentsActions.deleteAppointmentFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* updateAppointmentsStatusHandler(
  action: PayloadAction<{
    appointmentId: string;
    status: ENUM_APPOINTMENTS_STATUS;
  }>
) {
  try {
    const { appointmentId, status } = action.payload;
    const response: AppointmentsUpdateStatusResponse = yield call(
      AppointmentsService.updateAppointmentStatus,
      appointmentId,
      status
    );
    yield put(
      AppointmentsActions.updateAppointmentStatusSuccess({
        appointmentId,
        status,
      })
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(AppointmentsActions.updateAppointmentStatusFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}
export function* AppointmentsSaga() {
  yield takeLatest(
    AppointmentsActions.getAppointments,
    getAppointmentsListHandler
  );
  yield takeLatest(
    AppointmentsActions.getAppointmentDetail,
    getAppointmentsDetailHandler
  );
  yield takeLatest(
    AppointmentsActions.createAppointment,
    createAppointmentsHandler
  );
  yield takeLatest(
    AppointmentsActions.updateAppointment,
    updateAppointmentsHandler
  );
  yield takeLatest(
    AppointmentsActions.deleteAppointment,
    deleteAppointmentsHandler
  );
  yield takeLatest(
    AppointmentsActions.updateAppointmentStatus,
    updateAppointmentsStatusHandler
  );
}
