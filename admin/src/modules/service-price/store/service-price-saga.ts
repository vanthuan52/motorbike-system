import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { servicePriceActions } from "./service-price-slice";
import {
  ServicePrice,
  ServicePriceCreationResponse,
  ServicePriceDeleteResponse,
  ServicePriceDetailResponse,
  ServicePriceListResponse,
  ServicePricePaginationQuery,
  ServicePriceUpdateResponse,
} from "../types";
import servicePriceService from "../services/service-price.service";

function* getServicePriceListHandler(
  action: PayloadAction<ServicePricePaginationQuery>
) {
  try {
    const response: ServicePriceListResponse = yield call(
      servicePriceService.getServicePriceList,
      action.payload
    );

    const servicePrices = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      servicePriceActions.getServicePricesSuccess({
        list: servicePrices ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách dịch vụ thất bại!";
    yield put(servicePriceActions.getServicePricesFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getServicePriceDetailHandler(
  action: PayloadAction<{ servicePriceId: ServicePrice["_id"] }>
) {
  try {
    const { servicePriceId } = action.payload;
    const response: ServicePriceDetailResponse = yield call(
      servicePriceService.getServicePriceDetail,
      servicePriceId
    );
    const detail = response.data;
    yield put(servicePriceActions.getServicePriceDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết dịch vụ thất bại!";
    yield put(servicePriceActions.getServicePriceDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createServicePriceHandler(
  action: PayloadAction<{ servicePrice: ServicePrice }>
) {
  try {
    const { servicePrice } = action.payload;
    const response: ServicePriceCreationResponse = yield call(
      servicePriceService.createServicePrice,
      servicePrice
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(servicePriceActions.createServicePriceSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(servicePriceActions.createServicePriceFailure(message));
  }
}

function* updateServicePriceHandler(
  action: PayloadAction<{
    servicePriceId: string;
    servicePrice: ServicePrice;
  }>
) {
  try {
    const { servicePriceId, servicePrice } = action.payload;
    const response: ServicePriceUpdateResponse = yield call(
      servicePriceService.updateServicePrice,
      servicePriceId,
      servicePrice
    );

    yield put(servicePriceActions.updateServicePriceSuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(servicePriceActions.getServicePriceDetail({ servicePriceId }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(servicePriceActions.updateServicePriceFailure(message));
  }
}

function* deleteServicePriceHandler(
  action: PayloadAction<{ servicePriceId: ServicePrice["_id"] }>
) {
  try {
    const { servicePriceId } = action.payload;
    const response: ServicePriceDeleteResponse = yield call(
      servicePriceService.deleteServicePrice,
      servicePriceId
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
    yield put(servicePriceActions.deleteServicePriceSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(servicePriceActions.deleteServicePriceFailure(message));
  }
}

export function* ServicePriceSaga() {
  yield takeLatest(
    servicePriceActions.getServicePrices,
    getServicePriceListHandler
  );
  yield takeLatest(
    servicePriceActions.getServicePriceDetail,
    getServicePriceDetailHandler
  );
  yield takeLatest(
    servicePriceActions.createServicePrice,
    createServicePriceHandler
  );
  yield takeLatest(
    servicePriceActions.updateServicePrice,
    updateServicePriceHandler
  );
  yield takeLatest(
    servicePriceActions.deleteServicePrice,
    deleteServicePriceHandler
  );
}
