import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { serviceChecklistActions } from "./service-checklist-slice";
import {
  ServiceChecklist,
  ServiceChecklistCreationResponse,
  ServiceChecklistDeleteResponse,
  ServiceChecklistDetailResponse,
  ServiceChecklistListResponse,
  ServiceChecklistPaginationQuery,
  ServiceChecklistUpdateResponse,
} from "../types";
import serviceChecklistService from "../services/service-checklist.service";

function* getServiceChecklistListHandler(
  action: PayloadAction<ServiceChecklistPaginationQuery>
) {
  try {
    const response: ServiceChecklistListResponse = yield call(
      serviceChecklistService.getServiceChecklistList,
      action.payload
    );

    const serviceCategories = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      serviceChecklistActions.getServiceChecklistListSuccess({
        list: serviceCategories ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách danh mục thất bại!";
    yield put(serviceChecklistActions.getServiceChecklistListFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getServiceChecklistDetailHandler(
  action: PayloadAction<{ serviceChecklistId: ServiceChecklist["_id"] }>
) {
  try {
    const { serviceChecklistId } = action.payload;
    const response: ServiceChecklistDetailResponse = yield call(
      serviceChecklistService.getServiceChecklistDetail,
      serviceChecklistId
    );
    const detail = response.data;
    yield put(
      serviceChecklistActions.getServiceChecklistDetailSuccess(detail!)
    );
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết danh mục thất bại!";
    yield put(
      serviceChecklistActions.getServiceChecklistDetailFailure(message)
    );
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createServiceChecklistHandler(
  action: PayloadAction<{ serviceChecklist: ServiceChecklist }>
) {
  try {
    const { serviceChecklist } = action.payload;
    const response: ServiceChecklistCreationResponse = yield call(
      serviceChecklistService.createServiceChecklist,
      serviceChecklist
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(serviceChecklistActions.createServiceChecklistSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(serviceChecklistActions.createServiceChecklistFailure(message));
  }
}

function* updateServiceChecklistHandler(
  action: PayloadAction<{
    serviceChecklistId: string;
    serviceChecklist: ServiceChecklist;
  }>
) {
  try {
    const { serviceChecklistId, serviceChecklist } = action.payload;
    const response: ServiceChecklistUpdateResponse = yield call(
      serviceChecklistService.updateServiceChecklist,
      serviceChecklistId,
      serviceChecklist
    );

    yield put(serviceChecklistActions.updateServiceChecklistSuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(
      serviceChecklistActions.getServiceChecklistDetail({ serviceChecklistId })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(serviceChecklistActions.updateServiceChecklistFailure(message));
  }
}

function* deleteServiceChecklistHandler(
  action: PayloadAction<{ serviceChecklistId: ServiceChecklist["_id"] }>
) {
  try {
    const { serviceChecklistId } = action.payload;
    const response: ServiceChecklistDeleteResponse = yield call(
      serviceChecklistService.deleteServiceChecklist,
      serviceChecklistId
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
    yield put(serviceChecklistActions.deleteServiceChecklistSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(serviceChecklistActions.deleteServiceChecklistFailure(message));
  }
}

export function* ServiceChecklistSaga() {
  yield takeLatest(
    serviceChecklistActions.getServiceChecklistList,
    getServiceChecklistListHandler
  );
  yield takeLatest(
    serviceChecklistActions.getServiceChecklistDetail,
    getServiceChecklistDetailHandler
  );
  yield takeLatest(
    serviceChecklistActions.createServiceChecklist,
    createServiceChecklistHandler
  );
  yield takeLatest(
    serviceChecklistActions.updateServiceChecklist,
    updateServiceChecklistHandler
  );
  yield takeLatest(
    serviceChecklistActions.deleteServiceChecklist,
    deleteServiceChecklistHandler
  );
}
