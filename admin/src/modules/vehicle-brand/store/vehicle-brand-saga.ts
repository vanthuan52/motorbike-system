import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, take, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { vehicleBrandActions } from "./vehicle-brand-slice";
import {
  ENUM_VEHICLE_BRAND_STATUS,
  VehicleBrand,
  VehicleBrandCreationResponse,
  VehicleBrandDeleteResponse,
  VehicleBrandDetailResponse,
  VehicleBrandListResponse,
  VehicleBrandPaginationQuery,
  VehicleBrandUpdateResponse,
  VehicleBrandUpdateStatusResponse,
} from "../types";
import vehicleBrandService from "../services/vehicle-brand.service";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";

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
  action: PayloadAction<{ vehicleBrandId: VehicleBrand["_id"] }>
) {
  try {
    const { vehicleBrandId } = action.payload;
    const response: VehicleBrandDetailResponse = yield call(
      vehicleBrandService.getVehicleBrandDetail,
      vehicleBrandId
    );
    const detail = response.data;
    yield put(vehicleBrandActions.getVehicleBrandDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết hãng xe thất bại!";
    yield put(vehicleBrandActions.getVehicleBrandDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createVehicleBrandHandler(
  action: PayloadAction<{ vehicleBrand: VehicleBrand }>
) {
  try {
    const { vehicleBrand } = action.payload;
    const response: VehicleBrandCreationResponse = yield call(
      vehicleBrandService.createVehicleBrand,
      vehicleBrand
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(vehicleBrandActions.createVehicleBrandSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleBrandActions.createVehicleBrandFailure(message));
  }
}

function* updateVehicleBrandHandler(
  action: PayloadAction<{
    vehicleBrandId: string;
    vehicleBrand: VehicleBrand;
  }>
) {
  try {
    const { vehicleBrandId, vehicleBrand } = action.payload;
    const response: VehicleBrandUpdateResponse = yield call(
      vehicleBrandService.updateVehicleBrand,
      vehicleBrandId,
      vehicleBrand
    );

    yield put(vehicleBrandActions.updateVehicleBrandSuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(vehicleBrandActions.getVehicleBrandDetail({ vehicleBrandId }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleBrandActions.updateVehicleBrandFailure(message));
  }
}

function* deleteVehicleBrandHandler(
  action: PayloadAction<{ vehicleBrandId: VehicleBrand["_id"] }>
) {
  try {
    const { vehicleBrandId } = action.payload;
    const response: VehicleBrandDeleteResponse = yield call(
      vehicleBrandService.deleteVehicleBrand,
      vehicleBrandId
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
    yield put(vehicleBrandActions.deleteVehicleBrandSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleBrandActions.deleteVehicleBrandFailure(message));
  }
}

function* updateVehicleBrandStatusHandler(
  action: PayloadAction<{
    vehicleBrandId: string;
    status: ENUM_VEHICLE_BRAND_STATUS;
  }>
) {
  try {
    const { vehicleBrandId, status } = action.payload;
    const response: VehicleBrandUpdateStatusResponse = yield call(
      vehicleBrandService.updateVehicleBrandStatus,
      vehicleBrandId,
      status
    );

    yield put(
      vehicleBrandActions.updateVehicleBrandStatusSuccess({
        vehicleBrandId,
        status,
      })
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(vehicleBrandActions.updateVehicleBrandStatusFailure(message));
  }
}

function* initializeVehicleBrandSaga() {
  yield put(
    vehicleBrandActions.getVehicleBrands({ ...DEFAULT_PAGINATION_QUERY })
  );
  yield take([
    vehicleBrandActions.getVehicleBrandsSuccess.type,
    vehicleBrandActions.getVehicleBrandsFailure.type,
  ]);
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
  yield takeLatest(
    vehicleBrandActions.createVehicleBrand,
    createVehicleBrandHandler
  );
  yield takeLatest(
    vehicleBrandActions.updateVehicleBrand,
    updateVehicleBrandHandler
  );
  yield takeLatest(
    vehicleBrandActions.deleteVehicleBrand,
    deleteVehicleBrandHandler
  );
  yield takeLatest(
    vehicleBrandActions.updateVehicleBrandStatus,
    updateVehicleBrandStatusHandler
  );
  // yield call(initializeVehicleBrandSaga);
}
