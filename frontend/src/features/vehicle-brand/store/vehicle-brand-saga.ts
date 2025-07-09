import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { vehicleBrandActions } from "./vehicle-brand-slice";
import {
  VehicleBrand,
  VehicleBrandDetailResponse,
  VehicleBrandListResponse,
  VehicleBrandPaginationQuery,
} from "../types";
import vehicleBrandService from "../vehicle-brand.service";
import { notificationActions } from "@/features/notification/store/notification-slice";

function* getVehicleBrandListHandler(
  action: PayloadAction<VehicleBrandPaginationQuery>
) {
  try {
    const response: VehicleBrandListResponse = yield call(
      vehicleBrandService.getVehicleBrandList,
      action.payload
    );

    const serviceCategories = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      vehicleBrandActions.getVehicleBrandsSuccess({
        list: serviceCategories ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách hãng xe thất bại!";
    yield put(vehicleBrandActions.getVehicleBrandsFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getVehicleBrandDetailHandler(
  action: PayloadAction<{ vehicleBrandSlug: VehicleBrand["slug"] }>
) {
  try {
    const { vehicleBrandSlug } = action.payload;
    const response: VehicleBrandDetailResponse = yield call(
      vehicleBrandService.getVehicleBrandDetail,
      vehicleBrandSlug
    );
    const detail = response.data;
    yield put(vehicleBrandActions.getVehicleBrandDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết hãng xe thất bại!";
    yield put(vehicleBrandActions.getVehicleBrandDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

export function* vehicleBrandSaga() {
  yield takeLatest(
    vehicleBrandActions.getVehicleBrands,
    getVehicleBrandListHandler
  );
  yield takeLatest(
    vehicleBrandActions.getVehicleBrandDetail,
    getVehicleBrandDetailHandler
  );
}
