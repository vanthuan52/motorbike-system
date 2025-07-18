import { call, put, select, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { PaginationQuery } from "@/types/base.type";
import {
  CareRecordChecklist,
  CareRecordChecklistDetailResponse,
  CareRecordChecklistListResponse,
  CareRecordChecklistPaginationQuery,
  CareRecordChecklistUpdateStatusResponse,
  ENUM_CARE_RECORD_CHECKLIST_STATUS,
} from "../types";
import CareRecordChecklistService from "../services/care-record-checklist-api";
import { CareRecordChecklistActions } from "./care-record-checklist-slice";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { RootState } from "@/store";

function* getCareRecordChecklistsHandler(
  action: PayloadAction<CareRecordChecklistPaginationQuery>
) {
  try {
    const response: CareRecordChecklistListResponse = yield call(
      CareRecordChecklistService.getCareRecordChecklistList,
      action.payload
    );
    const CareRecordChecklists = response.data;
    const pagination = response._metadata?.pagination;

    yield put(
      CareRecordChecklistActions.getCareRecordChecklistsSuccess({
        CareRecordChecklists: CareRecordChecklists ?? [],
        pagination,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy hồ sơ bảo dưỡng thất bại!";
    yield put(
      CareRecordChecklistActions.getCareRecordChecklistsFailure(message)
    );
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getCareRecordChecklistDetailHandler(
  action: PayloadAction<{ CareRecordChecklistId: string }>
) {
  try {
    const { CareRecordChecklistId } = action.payload;
    const response: CareRecordChecklistDetailResponse = yield call(
      CareRecordChecklistService.getCareRecordChecklistDetails,
      CareRecordChecklistId
    );
    yield put(
      CareRecordChecklistActions.getCareRecordChecklistDetailSuccess(
        response.data!
      )
    );
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết hồ sơ chăm sóc thất bại!";
    yield put(
      CareRecordChecklistActions.getCareRecordChecklistDetailFailure(message)
    );
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createCareRecordChecklistHandler(
  action: PayloadAction<{ CareRecordChecklist: CareRecordChecklist }>
) {
  try {
    yield call(
      CareRecordChecklistService.createCareRecordChecklist,
      action.payload.CareRecordChecklist
    );
    toast.success("Tạo hồ sơ chăm sóc thành công!");
    yield put(CareRecordChecklistActions.createCareRecordChecklistSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.careRecordChecklists.pagination
    );
    yield put(CareRecordChecklistActions.getCareRecordChecklists(currentQuery));
  } catch (error: any) {
    const message = error.message || "Tạo hồ sơ chăm sóc thất bại!";
    yield put(
      CareRecordChecklistActions.createCareRecordChecklistFailure(message)
    );
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* updateCareRecordChecklistHandler(
  action: PayloadAction<{
    CareRecordChecklistId: string;
    CareRecordChecklist: CareRecordChecklist;
  }>
) {
  try {
    const { CareRecordChecklistId, CareRecordChecklist } = action.payload;
    yield call(
      CareRecordChecklistService.updateCareRecordChecklist,
      CareRecordChecklistId,
      CareRecordChecklist
    );
    toast.info("Cập nhật hồ sơ chăm sóc thành công!");
    yield put(CareRecordChecklistActions.updateCareRecordChecklistSuccess());
    yield put(
      CareRecordChecklistActions.getCareRecordChecklistDetail({
        CareRecordChecklistId: CareRecordChecklistId,
      })
    );
  } catch (error: any) {
    const message = error.message || "Cập nhật thất bại!";
    yield put(
      CareRecordChecklistActions.updateCareRecordChecklistFailure(message)
    );
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* deleteCareRecordChecklistHandler(
  action: PayloadAction<{ CareRecordChecklistId: string }>
) {
  try {
    const { CareRecordChecklistId } = action.payload;
    yield call(
      CareRecordChecklistService.deleteCareRecordChecklist,
      CareRecordChecklistId
    );
    toast.info("Xoá hồ sơ chăm sóc thành công!");
    yield put(CareRecordChecklistActions.deleteCareRecordChecklistSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.careRecordChecklists.pagination
    );
    yield put(CareRecordChecklistActions.getCareRecordChecklists(currentQuery));
  } catch (error: any) {
    const message = error.message || "Xoá thất bại!";
    yield put(
      CareRecordChecklistActions.deleteCareRecordChecklistFailure(message)
    );
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* updateCareRecordChecklistStatusHandler(
  action: PayloadAction<{
    CareRecordChecklistId: string;
    status: ENUM_CARE_RECORD_CHECKLIST_STATUS;
  }>
) {
  try {
    const { CareRecordChecklistId, status } = action.payload;
    const response: CareRecordChecklistUpdateStatusResponse = yield call(
      CareRecordChecklistService.updateCareRecordChecklistStatus,
      CareRecordChecklistId,
      status
    );

    yield put(
      CareRecordChecklistActions.updateCareRecordChecklistStatusSuccess({
        CareRecordChecklistId: CareRecordChecklistId,
        status,
      })
    );

    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      CareRecordChecklistActions.updateCareRecordChecklistStatusFailure(message)
    );
    yield put(notificationActions.notify({ type: "error", message }));
  }
}
export function* CareRecordChecklistsSaga() {
  yield takeLatest(
    CareRecordChecklistActions.getCareRecordChecklists.type,
    getCareRecordChecklistsHandler
  );
  yield takeLatest(
    CareRecordChecklistActions.getCareRecordChecklistDetail.type,
    getCareRecordChecklistDetailHandler
  );
  yield takeLatest(
    CareRecordChecklistActions.createCareRecordChecklist.type,
    createCareRecordChecklistHandler
  );
  yield takeLatest(
    CareRecordChecklistActions.updateCareRecordChecklist.type,
    updateCareRecordChecklistHandler
  );
  yield takeLatest(
    CareRecordChecklistActions.deleteCareRecordChecklist.type,
    deleteCareRecordChecklistHandler
  );
  yield takeLatest(
    CareRecordChecklistActions.updateCareRecordChecklistStatus.type,
    updateCareRecordChecklistStatusHandler
  );
}
