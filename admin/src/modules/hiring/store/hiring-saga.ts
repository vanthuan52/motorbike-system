import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { hiringActions } from "./hiring-slice";
import { Hiring, HiringStatusEnum } from "../types";
import { hiringService } from "../services/hirings-api";

function* fetchHiringsHandler(
  action: PayloadAction<object>
): Generator<any, void, any> {
  try {
    const payload = action.payload;
    const data = yield call(hiringService.getHiringList, payload);
    yield put(hiringActions.fetchHiringSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(hiringActions.fetchHiringFailure(message));
  }
}

function* fetchHiringDetailHandler(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    const id = action.payload;
    const data = yield call(hiringService.getHiringDetails, id);
    yield put(hiringActions.fetchHiringDetailSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(hiringActions.fetchHiringDetailFailure(message));
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
    yield put(hiringActions.createHiringFailure(message));
  }
}

function* updateHiringHandler(
  action: PayloadAction<{ hiring: Hiring; id: string }>
) {
  try {
    const { hiring, id } = action.payload;
    yield call(hiringService.updateHiring, id, hiring);
    toast.success("Cập nhật bài tuyển dụng thành công");
    yield put(hiringActions.updateHiringSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(hiringActions.updateHiringFailure(message));
  }
}

function* deleteHiringHandler(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    yield call(hiringService.deleteHiring, id);
    toast.success("Xoá bài tuyển dụng thành công");
    yield put(hiringActions.deleteHiringSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(hiringActions.deleteHiringFailure(message));
  }
}

function* updateHiringStatusHandler(
  action: PayloadAction<{ id: string; status: HiringStatusEnum }>
) {
  try {
    const { id, status } = action.payload;
    yield call(hiringService.updateHiringStatus, id, status);
    toast.success("Cập nhật trạng thái bài tuyển dụng thành công");
    yield put(hiringActions.updateStatusHiringSuccess({ id, status }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(hiringActions.updateStatusHiringFailure(message));
  }
}

export function* hiringRootSaga() {
  yield takeLatest(hiringActions.fetchHiringRequest, fetchHiringsHandler);
  yield takeLatest(
    hiringActions.fetchHiringDetailRequest,
    fetchHiringDetailHandler
  );
  yield takeLatest(hiringActions.createHiringRequest, createHiringHandler);
  yield takeLatest(hiringActions.updateHiringRequest, updateHiringHandler);
  yield takeLatest(hiringActions.deleteHiringRequest, deleteHiringHandler);
  yield takeLatest(
    hiringActions.updateStatusHiringRequest,
    updateHiringStatusHandler
  );
}
