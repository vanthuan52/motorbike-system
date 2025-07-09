import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { vehicleModelActions } from "./vehicle-model-slice";
import {
  ENUM_VEHICLE_MODEL_STATUS,
  VehicleModel,
  VehicleModelCreationResponse,
  VehicleModelDeleteResponse,
  VehicleModelDetailResponse,
  VehicleModelListResponse,
  VehicleModelPaginationQuery,
  VehicleModelUpdateResponse,
  VehicleModelUpdateStatusResponse,
} from "../types";
import vehicleModelService from "../vehicle-model.service";
import { notificationActions } from "@/features/notification/store/notification-slice";

function* getVehicleModelListHandler(
  action: PayloadAction<VehicleModelPaginationQuery>
) {
  try {
    const response: VehicleModelListResponse = yield call(
      vehicleModelService.getVehicleModelList,
      action.payload
    );

    const VehicleModels = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      vehicleModelActions.getVehicleModelsSuccess({
        list: VehicleModels ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách dịch vụ thất bại!";
    yield put(vehicleModelActions.getVehicleModelsFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getVehicleModelDetailHandler(
  action: PayloadAction<{ vehicleModelSlug: VehicleModel["slug"] }>
) {
  try {
    const { vehicleModelSlug } = action.payload;
    const response: VehicleModelDetailResponse = yield call(
      vehicleModelService.getVehicleModelDetail,
      vehicleModelSlug
    );
    const detail = response.data;
    yield put(vehicleModelActions.getVehicleModelDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết dịch vụ thất bại!";
    yield put(vehicleModelActions.getVehicleModelDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

export function* vehicleModelSaga() {
  yield takeLatest(
    vehicleModelActions.getVehicleModels,
    getVehicleModelListHandler
  );
  yield takeLatest(
    vehicleModelActions.getVehicleModelDetail,
    getVehicleModelDetailHandler
  );
}
