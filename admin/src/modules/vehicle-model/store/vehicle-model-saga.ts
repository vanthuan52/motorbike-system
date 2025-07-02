import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
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
import vehicleModelService from "../services/vehicle-model.service";

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
  action: PayloadAction<{ vehicleModelId: VehicleModel["_id"] }>
) {
  try {
    const { vehicleModelId } = action.payload;
    const response: VehicleModelDetailResponse = yield call(
      vehicleModelService.getVehicleModelDetail,
      vehicleModelId
    );
    const detail = response.data;
    yield put(vehicleModelActions.getVehicleModelDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết dịch vụ thất bại!";
    yield put(vehicleModelActions.getVehicleModelDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createVehicleModelHandler(
  action: PayloadAction<{ vehicleModel: VehicleModel }>
) {
  try {
    const { vehicleModel } = action.payload;
    const response: VehicleModelCreationResponse = yield call(
      vehicleModelService.createVehicleModel,
      vehicleModel
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(vehicleModelActions.createVehicleModelSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleModelActions.createVehicleModelFailure(message));
  }
}

function* updateVehicleModelHandler(
  action: PayloadAction<{
    vehicleModelId: string;
    vehicleModel: VehicleModel;
  }>
) {
  try {
    const { vehicleModelId, vehicleModel } = action.payload;
    const response: VehicleModelUpdateResponse = yield call(
      vehicleModelService.updateVehicleModel,
      vehicleModelId,
      vehicleModel
    );

    yield put(vehicleModelActions.updateVehicleModelSuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(vehicleModelActions.getVehicleModelDetail({ vehicleModelId }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleModelActions.updateVehicleModelFailure(message));
  }
}

function* deleteVehicleModelHandler(
  action: PayloadAction<{ vehicleModelId: VehicleModel["_id"] }>
) {
  try {
    const { vehicleModelId } = action.payload;
    const response: VehicleModelDeleteResponse = yield call(
      vehicleModelService.deleteVehicleModel,
      vehicleModelId
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
    yield put(vehicleModelActions.deleteVehicleModelSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleModelActions.deleteVehicleModelFailure(message));
  }
}

function* updateVehicleModelStatusHandler(
  action: PayloadAction<{
    vehicleModelId: string;
    status: ENUM_VEHICLE_MODEL_STATUS;
  }>
) {
  try {
    const { vehicleModelId, status } = action.payload;
    const response: VehicleModelUpdateStatusResponse = yield call(
      vehicleModelService.updateVehicleModelStatus,
      vehicleModelId,
      status
    );

    yield put(
      vehicleModelActions.updateVehicleModelStatusSuccess({
        vehicleModelId,
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
    yield put(vehicleModelActions.updateVehicleModelStatusFailure(message));
  }
}
export function* VehicleModelSaga() {
  yield takeLatest(
    vehicleModelActions.getVehicleModels,
    getVehicleModelListHandler
  );
  yield takeLatest(
    vehicleModelActions.getVehicleModelDetail,
    getVehicleModelDetailHandler
  );
  yield takeLatest(
    vehicleModelActions.createVehicleModel,
    createVehicleModelHandler
  );
  yield takeLatest(
    vehicleModelActions.updateVehicleModel,
    updateVehicleModelHandler
  );
  yield takeLatest(
    vehicleModelActions.deleteVehicleModel,
    deleteVehicleModelHandler
  );
  yield takeLatest(
    vehicleModelActions.updateVehicleModelStatus,
    updateVehicleModelStatusHandler
  );
}
