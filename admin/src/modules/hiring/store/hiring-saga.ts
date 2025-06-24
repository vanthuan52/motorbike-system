import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { hiringActions } from "./hiring-slice";
import {
  Hiring,
  ENUM_HIRING_STATUS,
  HiringPaginationQuery,
  HiringDetailResponse,
  HiringListResponse,
} from "../types";
import hiringService from "../services/hirings-api";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { RootState } from "@/store";

function* fetchHiringHandler(action: PayloadAction<HiringPaginationQuery>) {
  try {
    const response: HiringListResponse = yield call(
      hiringService.getHiringList,
      action.payload
    );

    const hiring = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      hiringActions.getHiringSuccess({
        hiringList: hiring ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const errorMessage =
      error.message || "Lấy danh sách bài tuyển dụng thất bài!";
    yield put(hiringActions.getHiringFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

function* fetchHiringDetailHandler(
  action: PayloadAction<{ hiringId: Hiring["_id"] }>
) {
  try {
    const { hiringId } = action.payload;
    const response: HiringDetailResponse = yield call(
      hiringService.getHiringDetails,
      hiringId
    );
    const hiringDetail = response.data;
    yield put(hiringActions.getHiringDetailSuccess(hiringDetail!));
  } catch (error: any) {
    const errorMessage =
      error.message || "Lấy chi tiết bài tuyển dụng thất bài!";
    yield put(hiringActions.getHiringDetailFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

function* createHiringHandler(action: PayloadAction<{ hiring: Hiring }>) {
  try {
    const { hiring } = action.payload;
    yield call(hiringService.createHiring, hiring);
    toast.success("Tạo bài tuyển dụng thành công");
    yield put(hiringActions.createHiringSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(hiringActions.createHiringFailure(message));
  }
}

function* updateHiringHandler(
  action: PayloadAction<{ hiring: Hiring; hiringId: string }>
) {
  try {
    const { hiringId, hiring } = action.payload;
    yield call(hiringService.updateHiring, hiringId, hiring);
    yield put(
      notificationActions.notify({
        type: "info",
        message: "Cập nhật thành công!",
      })
    );
    yield put(hiringActions.updateHiringSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(hiringActions.updateHiringFailure(message));
  }
}

function* deleteHiringHandler(action: PayloadAction<{ hiringId: string }>) {
  try {
    const currentQuery: HiringPaginationQuery = yield select(
      (state: RootState) => state.hiring.pagination
    );
    const { hiringId } = action.payload;
    yield call(hiringService.deleteHiring, hiringId);
    yield put(
      notificationActions.notify({
        type: "info",
        message: "Xóa thành công!",
      })
    );
    yield put(hiringActions.deleteHiringSuccess());
    yield put(hiringActions.getHiring(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(hiringActions.deleteHiringFailure(message));
  }
}

function* updateHiringStatusHandler(
  action: PayloadAction<{ hiringId: string; status: ENUM_HIRING_STATUS }>
) {
  try {
    const { hiringId, status } = action.payload;
    yield call(hiringService.updateHiringStatus, hiringId, status);
    yield put(
      notificationActions.notify({
        type: "info",
        message: "Cập nhật thành công!",
      })
    );
    yield put(hiringActions.updateHiringStatusSuccess());
    yield put(hiringActions.getHiringDetail({ hiringId }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(hiringActions.updateHiringStatusFailure(message));
  }
}

export function* hiringRootSaga() {
  yield takeLatest(hiringActions.getHiring, fetchHiringHandler);
  yield takeLatest(
    hiringActions.getHiringDetail.type,
    fetchHiringDetailHandler
  );
  yield takeLatest(hiringActions.createHiring, createHiringHandler);
  yield takeLatest(hiringActions.updateHiring.type, updateHiringHandler);
  yield takeLatest(hiringActions.deleteHiring.type, deleteHiringHandler);
  yield takeLatest(
    hiringActions.updateHiringStatus.type,
    updateHiringStatusHandler
  );
}
