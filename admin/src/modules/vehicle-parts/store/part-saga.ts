import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";

import { notificationActions } from "@/modules/notification/store/notification-slice";
import { RootState } from "@/store";
import { vehiclePartActions } from "./part-slice";
import {
  ENUM_PART_STATUS,
  VehiclePart,
  PartDetailResponse,
  PartListResponse,
  PartPaginationQuery,
  PartUpdateStatusResponse,
} from "../types";
import { PaginationQuery } from "@/types/base.type";
import partsService from "../services/part-service.ts";

function* getPartHandler(action: PayloadAction<PartPaginationQuery>) {
  try {
    const response: PartListResponse = yield call(
      partsService.getPartList,
      action.payload
    );

    const parts = response.data;
    const pagination = response?._metadata?.pagination;

    yield put(
      vehiclePartActions.getPartSuccess({
        list: parts ?? [],
        pagination,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách phụ tùng thất bại!";
    yield put(vehiclePartActions.getPartFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getPartDetailHandler(
  action: PayloadAction<{ partId: VehiclePart["_id"] }>
) {
  try {
    const { partId } = action.payload;
    const response: PartDetailResponse = yield call(
      partsService.getPartDetails,
      partId
    );
    const detail = response.data;
    yield put(vehiclePartActions.getPartDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết phụ tùng thất bại!";
    yield put(vehiclePartActions.getPartDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createPartHandler(action: PayloadAction<{ part: VehiclePart }>) {
  try {
    const { part } = action.payload;
    yield call(partsService.createPart, part);
    toast.success("Tạo phụ tùng thành công!");
    yield put(vehiclePartActions.createPartSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.vehicleParts.pagination
    );
    yield put(vehiclePartActions.getPart(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehiclePartActions.createPartFailure(message));
  }
}

function* updatePartHandler(
  action: PayloadAction<{ partId: string; part: VehiclePart }>
) {
  try {
    const { partId, part } = action.payload;
    const response: PartUpdateStatusResponse = yield call(
      partsService.updatePart,
      partId,
      part
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(vehiclePartActions.updatePartSuccess());

    yield put(vehiclePartActions.getPartDetail({ partId }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehiclePartActions.updatePartFailure(message));
  }
}

function* deletePartHandler(
  action: PayloadAction<{ partId: VehiclePart["_id"] }>
) {
  try {
    const { partId } = action.payload;
    yield call(partsService.deletePart, partId);
    yield put(
      notificationActions.notify({ type: "info", message: "Xóa thành công!" })
    );
    yield put(vehiclePartActions.deletePartSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.vehicleParts.pagination
    );
    yield put(vehiclePartActions.getPart(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehiclePartActions.deletePartFailure(message));
  }
}

function* updatePartStatusHandler(
  action: PayloadAction<{ partId: string; status: ENUM_PART_STATUS }>
) {
  try {
    const { partId, status } = action.payload;
    const response: PartUpdateStatusResponse = yield call(
      partsService.updatePartStatus,
      partId,
      status
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(vehiclePartActions.updatePartStatusSuccess({ partId, status }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(vehiclePartActions.updatePartStatusFailure(message));
  }
}
export function* vehiclePartsRootSaga() {
  yield takeLatest(vehiclePartActions.getPart, getPartHandler);
  yield takeLatest(vehiclePartActions.getPartDetail.type, getPartDetailHandler);
  yield takeLatest(vehiclePartActions.createPart, createPartHandler);
  yield takeLatest(vehiclePartActions.updatePart.type, updatePartHandler);
  yield takeLatest(vehiclePartActions.deletePart.type, deletePartHandler);
  yield takeLatest(
    vehiclePartActions.updatePartStatus.type,
    updatePartStatusHandler
  );
}
