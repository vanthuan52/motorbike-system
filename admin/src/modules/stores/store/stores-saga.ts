import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  ENUM_STORE_STATUS,
  Store,
  StoreDetailResponse,
  StoreListResponse,
  StorePaginationQuery,
  StoreUpdateStatusResponse,
} from "../types";
import storeService from "../services/store-api";
import { PayloadAction } from "@reduxjs/toolkit";
import { Store as StoreEntity } from "../types";
import { storeActions } from "./stores-slice";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { toast } from "react-toastify";
import { PaginationQuery } from "@/types/base.type";
import { RootState } from "@/store";
import { Payload } from "recharts/types/component/DefaultLegendContent";

function* getStoreHandler(action: PayloadAction<StorePaginationQuery>) {
  try {
    const response: StoreListResponse = yield call(
      storeService.getStoreList,
      action.payload
    );
    const stores = response.data;
    const pagination = response?._metadata?.pagination;

    yield put(
      storeActions.getStoreSuccess({
        stores: stores ?? [],
        pagination,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách cửa hàng thất bại!";
    yield put(storeActions.getStoreFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}
function* getStoreDetailHandler(
  action: PayloadAction<{ storeId: StoreEntity["_id"] }>
) {
  try {
    const { storeId } = action.payload;
    const response: StoreDetailResponse = yield call(
      storeService.getStoreDetails,
      storeId
    );
    const detail = response.data;
    yield put(storeActions.getStoreDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết cửa hàng thất bại!";
    yield put(storeActions.getStoreDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createStoreHandler(action: PayloadAction<{ store: StoreEntity }>) {
  try {
    const { store } = action.payload;
    yield call(storeService.createStore, store);
    toast.success("Tạo cửa hàng thành công!");
    yield put(storeActions.createStoreSuccess());

    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.stores.pagination
    );
    yield put(storeActions.getStore(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(storeActions.createStoreFailure(message));
  }
}

function* updateStoreHandler(
  action: PayloadAction<{ storeId: string; store: StoreEntity }>
) {
  try {
    const { storeId, store } = action.payload;
    yield call(storeService.updateStore, storeId, store);
    yield put(
      notificationActions.notify({
        type: "info",
        message: "Cập nhật cửa hàng thành công!",
      })
    );
    yield put(storeActions.updateStoreSuccess());
    yield put(storeActions.getStoreDetail({ storeId }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(storeActions.updateStoreFailure(message));
  }
}

function* deleteStoreHandler(
  action: PayloadAction<{ storeId: StoreEntity["_id"] }>
) {
  try {
    const { storeId } = action.payload;
    yield call(storeService.deleteStore, storeId);
    yield put(
      notificationActions.notify({
        type: "info",
        message: "Xóa cửa hàng thành công!",
      })
    );
    yield put(storeActions.deleteStoreSuccess());
    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.stores.pagination
    );
    yield put(storeActions.getStore(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(storeActions.deleteStoreFailure(message));
  }
}

function* updateStoreStatusHandler(
  action: PayloadAction<{ storeId: string; status: ENUM_STORE_STATUS }>
) {
  try {
    const { storeId, status } = action.payload;
    const response: StoreUpdateStatusResponse = yield call(
      storeService.updateStoreStatus,
      storeId,
      status
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(storeActions.updateStoreStatusSuccess());
    yield put(storeActions.getStoreDetail({ storeId }));
    const currentQuery: PaginationQuery = yield select(
      (state: RootState) => state.stores.pagination
    );
    yield put(storeActions.getStore(currentQuery));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(storeActions.updateStoreStatusFailure(message));
  }
}

export function* storesRootSaga() {
  yield takeLatest(storeActions.getStore, getStoreHandler);
  yield takeLatest(storeActions.getStoreDetail.type, getStoreDetailHandler);
  yield takeLatest(storeActions.createStore, createStoreHandler);
  yield takeLatest(storeActions.updateStore.type, updateStoreHandler);
  yield takeLatest(storeActions.deleteStore.type, deleteStoreHandler);
  yield takeLatest(
    storeActions.updateStoreStatus.type,
    updateStoreStatusHandler
  );
}
