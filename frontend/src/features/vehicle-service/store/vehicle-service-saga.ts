import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { vehicleServiceActions } from "./vehicle-service-slice";
import {
  VehicleService,
  VehicleServiceDetailResponse,
  VehicleServiceListResponse,
  VehicleServicePaginationQuery,
} from "../types";
import vehicleServiceService from "../vehicle-service.service";
import { notificationActions } from "@/features/notification/store/notification-slice";

function* getVehicleServiceListHandler(
  action: PayloadAction<VehicleServicePaginationQuery>
) {
  try {
    const response: VehicleServiceListResponse = yield call(
      vehicleServiceService.getVehicleServiceList,
      action.payload
    );

    const VehicleServices = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      vehicleServiceActions.getVehicleServicesSuccess({
        list: VehicleServices ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách dịch vụ thất bại!";
    yield put(vehicleServiceActions.getVehicleServicesFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getVehicleServiceDetailHandler(
  action: PayloadAction<{ vehicleServiceSlug: VehicleService["slug"] }>
) {
  try {
    const { vehicleServiceSlug } = action.payload;
    const response: VehicleServiceDetailResponse = yield call(
      vehicleServiceService.getVehicleServiceDetail,
      vehicleServiceSlug
    );
    const detail = response.data;
    yield put(vehicleServiceActions.getVehicleServiceDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết dịch vụ thất bại!";
    yield put(vehicleServiceActions.getVehicleServiceDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

export function* vehicleServiceSaga() {
  yield takeLatest(
    vehicleServiceActions.getVehicleServices,
    getVehicleServiceListHandler
  );
  yield takeLatest(
    vehicleServiceActions.getVehicleServiceDetail,
    getVehicleServiceDetailHandler
  );
}
