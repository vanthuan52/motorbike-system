import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";

import { notificationActions } from "@/modules/notification/store/notification-slice";
import { RootState } from "@/store";
import { partTypeActions } from "./part-types-slice";
import {
  ENUM_PART_TYPE_STATUS,
  PartType,
  PartTypeDetailResponse,
  PartTypeListResponse,
  PartTypePaginationQuery,
  PartTypeUpdateStatusResponse,
} from "../types";
import { PaginationQuery } from "@/types/base.type";
import partTypesService from "../services/part-types-api";

function* getPartTypeHandler(action: PayloadAction<PartTypePaginationQuery>) {
  try {
    const response: PartTypeListResponse = yield call(
      partTypesService.getPartTypeList,
      action.payload
    );

    const partTypes = response.data;
    const pagination = response?._metadata?.pagination;

    yield put(
      partTypeActions.getPartTypeSuccess({
        partTypes: partTypes ?? [],
        pagination,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách danh mục thất bại!";
    yield put(partTypeActions.getPartTypeFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getPartTypeDetailHandler(
  action: PayloadAction<{ partTypeId: PartType["_id"] }>
) {
  try {
    const { partTypeId } = action.payload;
    const response: PartTypeDetailResponse = yield call(
      partTypesService.getPartTypeDetails,
      partTypeId
    );
    const detail = response.data;
    yield put(partTypeActions.getPartTypeDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết danh mục thất bại!";
    yield put(partTypeActions.getPartTypeDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createPartTypeHandler(action: PayloadAction<{ partType: PartType }>) {
  try {
    const { partType } = action.payload;
    yield call(partTypesService.createPartType, partType);
    toast.success("Tạo danh mục thành công!");
    yield put(partTypeActions.createPartTypeSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.partTypes.pagination
    );
    yield put(partTypeActions.getPartType(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(partTypeActions.createPartTypeFailure(message));
  }
}

function* updatePartTypeHandler(
  action: PayloadAction<{ partTypeId: string; partType: PartType }>
) {
  try {
    const { partTypeId, partType } = action.payload;
    const response: PartTypeUpdateStatusResponse = yield call(
      partTypesService.updatePartType,
      partTypeId,
      partType
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(partTypeActions.updatePartTypeSuccess());

    yield put(partTypeActions.getPartTypeDetail({ partTypeId }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(partTypeActions.updatePartTypeFailure(message));
  }
}

function* deletePartTypeHandler(
  action: PayloadAction<{ partTypeId: PartType["_id"] }>
) {
  try {
    const { partTypeId } = action.payload;
    yield call(partTypesService.deletePartType, partTypeId);
    yield put(
      notificationActions.notify({ type: "info", message: "Xóa thành công!" })
    );
    yield put(partTypeActions.deletePartTypeSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.partTypes.pagination
    );
    yield put(partTypeActions.getPartType(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(partTypeActions.deletePartTypeFailure(message));
  }
}

function* updatePartTypeStatusHandler(
  action: PayloadAction<{ partTypeId: string; status: ENUM_PART_TYPE_STATUS }>
) {
  try {
    const { partTypeId, status } = action.payload;
    const response: PartTypeUpdateStatusResponse = yield call(
      partTypesService.updatePartTypeStatus,
      partTypeId,
      status
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(
      partTypeActions.updatePartTypeStatusSuccess({ partTypeId, status })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(partTypeActions.updatePartTypeStatusFailure(message));
  }
}
export function* partTypesRootSaga() {
  yield takeLatest(partTypeActions.getPartType, getPartTypeHandler);
  yield takeLatest(
    partTypeActions.getPartTypeDetail.type,
    getPartTypeDetailHandler
  );
  yield takeLatest(partTypeActions.createPartType, createPartTypeHandler);
  yield takeLatest(partTypeActions.updatePartType.type, updatePartTypeHandler);
  yield takeLatest(partTypeActions.deletePartType.type, deletePartTypeHandler);
  yield takeLatest(
    partTypeActions.updatePartTypeStatus.type,
    updatePartTypeStatusHandler
  );
}
