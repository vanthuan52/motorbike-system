import { call, put, select, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { careRecordActions } from "./care-record-slice";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { RootState } from "@/store";

import careRecordService from "../services/care-record-api";
import {
  CareRecord,
  CareRecordDetailResponse,
  CareRecordListResponse,
  CareRecordPaginationQuery,
  CareRecordUpdateStatusResponse,
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from "../types";
import { PaginationQuery } from "@/types/base.type";

function* getCareRecordsHandler(
  action: PayloadAction<CareRecordPaginationQuery>
) {
  try {
    const response: CareRecordListResponse = yield call(
      careRecordService.getCareRecordList,
      action.payload
    );
    const careRecords = response.data;
    const pagination = response._metadata?.pagination;

    yield put(
      careRecordActions.getCareRecordsSuccess({
        careRecords: careRecords ?? [],
        pagination,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy hồ sơ bảo dưỡng thất bại!";
    yield put(careRecordActions.getCareRecordsFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getCareRecordDetailHandler(
  action: PayloadAction<{ careRecordId: string }>
) {
  try {
    const { careRecordId } = action.payload;
    const response: CareRecordDetailResponse = yield call(
      careRecordService.getCareRecordDetails,
      careRecordId
    );
    yield put(careRecordActions.getCareRecordDetailSuccess(response.data!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết hồ sơ chăm sóc thất bại!";
    yield put(careRecordActions.getCareRecordDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createCareRecordHandler(
  action: PayloadAction<{ careRecord: CareRecord }>
) {
  try {
    yield call(careRecordService.createCareRecord, action.payload.careRecord);
    toast.success("Tạo hồ sơ chăm sóc thành công!");
    yield put(careRecordActions.createCareRecordSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.careRecords.pagination
    );
    yield put(careRecordActions.getCareRecords(currentQuery));
  } catch (error: any) {
    const message = error.message || "Tạo hồ sơ chăm sóc thất bại!";
    yield put(careRecordActions.createCareRecordFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* updateCareRecordHandler(
  action: PayloadAction<{ careRecordId: string; careRecord: CareRecord }>
) {
  try {
    const { careRecordId, careRecord } = action.payload;
    yield call(careRecordService.updateCareRecord, careRecordId, careRecord);
    toast.info("Cập nhật hồ sơ chăm sóc thành công!");
    yield put(careRecordActions.updateCareRecordSuccess());
    yield put(careRecordActions.getCareRecordDetail({ careRecordId }));
  } catch (error: any) {
    const message = error.message || "Cập nhật thất bại!";
    yield put(careRecordActions.updateCareRecordFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* deleteCareRecordHandler(
  action: PayloadAction<{ careRecordId: string }>
) {
  try {
    const { careRecordId } = action.payload;
    yield call(careRecordService.deleteCareRecord, careRecordId);
    toast.info("Xoá hồ sơ chăm sóc thành công!");
    yield put(careRecordActions.deleteCareRecordSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.careRecords.pagination
    );
    yield put(careRecordActions.getCareRecords(currentQuery));
  } catch (error: any) {
    const message = error.message || "Xoá thất bại!";
    yield put(careRecordActions.deleteCareRecordFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* updateCareRecordStatusHandler(
  action: PayloadAction<{
    careRecordId: string;
    status: ENUM_CARE_RECORD_STATUS;
  }>
) {
  try {
    const { careRecordId, status } = action.payload;
    const response: CareRecordUpdateStatusResponse = yield call(
      careRecordService.updateCareRecordStatus,
      careRecordId,
      status
    );

    yield put(
      careRecordActions.updateCareRecordStatusSuccess({
        careRecordId,
        status,
      })
    );

    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(careRecordActions.updateCareRecordStatusFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}
function* updatePaymentStatusHandler(
  action: PayloadAction<{
    careRecordId: string;
    paymentStatus: ENUM_PAYMENT_STATUS;
  }>
) {
  try {
    const { careRecordId, paymentStatus } = action.payload;
    yield call(
      careRecordService.updateCareRecordPaymentStatus,
      careRecordId,
      paymentStatus
    );
    toast.info("Cập nhật trạng thái thanh toán thành công!");
    yield put(careRecordActions.updatePaymentStatusSuccess());
    yield put(careRecordActions.getCareRecordDetail({ careRecordId }));
  } catch (error: any) {
    const message = error.message || "Cập nhật trạng thái thanh toán thất bại!";
    yield put(careRecordActions.updatePaymentStatusFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* assignTechnicianHandler(
  action: PayloadAction<{ careRecordId: string; technicianId: string }>
) {
  try {
    const { careRecordId, technicianId } = action.payload;
    yield call(
      careRecordService.assignCareRecordTechnician,
      careRecordId,
      technicianId
    );
    toast.info("Giao kỹ thuật viên thành công!");
    yield put(careRecordActions.assignTechnicianSuccess());
    yield put(careRecordActions.getCareRecordDetail({ careRecordId }));
  } catch (error: any) {
    const message = error.message || "Giao kỹ thuật viên thất bại!";
    yield put(careRecordActions.assignTechnicianFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

export function* careRecordsSaga() {
  yield takeLatest(
    careRecordActions.getCareRecords.type,
    getCareRecordsHandler
  );
  yield takeLatest(
    careRecordActions.getCareRecordDetail.type,
    getCareRecordDetailHandler
  );
  yield takeLatest(
    careRecordActions.createCareRecord.type,
    createCareRecordHandler
  );
  yield takeLatest(
    careRecordActions.updateCareRecord.type,
    updateCareRecordHandler
  );
  yield takeLatest(
    careRecordActions.deleteCareRecord.type,
    deleteCareRecordHandler
  );
  yield takeLatest(
    careRecordActions.updateCareRecordStatus.type,
    updateCareRecordStatusHandler
  );
  yield takeLatest(
    careRecordActions.updatePaymentStatus.type,
    updatePaymentStatusHandler
  );
  yield takeLatest(
    careRecordActions.assignTechnician.type,
    assignTechnicianHandler
  );
}
