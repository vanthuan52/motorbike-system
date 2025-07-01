import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { vehicleServiceActions } from "./vehicle-service-slice";
import {
  ENUM_VEHICLE_SERVICE_STATUS,
  VehicleService,
  VehicleServiceCreationResponse,
  VehicleServiceDeleteResponse,
  VehicleServiceDetailResponse,
  VehicleServiceListResponse,
  VehicleServicePaginationQuery,
  VehicleServiceUpdateResponse,
  VehicleServiceUpdateStatusResponse,
} from "../types";
import vehicleServiceService from "../services/vehicle-service.service";

function* getVehicleServiceListHandler(
  action: PayloadAction<VehicleServicePaginationQuery>
) {
  try {
    const response: VehicleServiceListResponse = yield call(
      vehicleServiceService.getVehicleServiceList,
      action.payload
    );

    const vehicleServices = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      vehicleServiceActions.getVehicleServicesSuccess({
        list: vehicleServices ?? [],
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
  action: PayloadAction<{ vehicleServiceId: VehicleService["_id"] }>
) {
  try {
    const { vehicleServiceId } = action.payload;
    const response: VehicleServiceDetailResponse = yield call(
      vehicleServiceService.getVehicleServiceDetail,
      vehicleServiceId
    );
    const detail = response.data;
    yield put(vehicleServiceActions.getVehicleServiceDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết dịch vụ thất bại!";
    yield put(vehicleServiceActions.getVehicleServiceDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createVehicleServiceHandler(
  action: PayloadAction<{ vehicleService: VehicleService }>
) {
  try {
    const { vehicleService } = action.payload;
    const response: VehicleServiceCreationResponse = yield call(
      vehicleServiceService.createVehicleService,
      vehicleService
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(vehicleServiceActions.createVehicleServiceSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleServiceActions.createVehicleServiceFailure(message));
  }
}

function* updateVehicleServiceHandler(
  action: PayloadAction<{
    vehicleServiceId: string;
    vehicleService: VehicleService;
  }>
) {
  try {
    const { vehicleServiceId, vehicleService } = action.payload;
    const response: VehicleServiceUpdateResponse = yield call(
      vehicleServiceService.updateVehicleService,
      vehicleServiceId,
      vehicleService
    );

    yield put(vehicleServiceActions.updateVehicleServiceSuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(
      vehicleServiceActions.getVehicleServiceDetail({ vehicleServiceId })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleServiceActions.updateVehicleServiceFailure(message));
  }
}

function* deleteVehicleServiceHandler(
  action: PayloadAction<{ vehicleServiceId: VehicleService["_id"] }>
) {
  try {
    const { vehicleServiceId } = action.payload;
    const response: VehicleServiceDeleteResponse = yield call(
      vehicleServiceService.deleteVehicleService,
      vehicleServiceId
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
    yield put(vehicleServiceActions.deleteVehicleServiceSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(vehicleServiceActions.deleteVehicleServiceFailure(message));
  }
}

function* updateVehicleServiceStatusHandler(
  action: PayloadAction<{
    vehicleServiceId: string;
    status: ENUM_VEHICLE_SERVICE_STATUS;
  }>
) {
  try {
    const { vehicleServiceId, status } = action.payload;
    const response: VehicleServiceUpdateStatusResponse = yield call(
      vehicleServiceService.updateVehicleServiceStatus,
      vehicleServiceId,
      status
    );

    yield put(
      vehicleServiceActions.updateVehicleServiceStatusSuccess({
        vehicleServiceId,
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
    yield put(vehicleServiceActions.updateVehicleServiceStatusFailure(message));
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
  yield takeLatest(
    vehicleServiceActions.createVehicleService,
    createVehicleServiceHandler
  );
  yield takeLatest(
    vehicleServiceActions.updateVehicleService,
    updateVehicleServiceHandler
  );
  yield takeLatest(
    vehicleServiceActions.deleteVehicleService,
    deleteVehicleServiceHandler
  );
  yield takeLatest(
    vehicleServiceActions.updateVehicleServiceStatus,
    updateVehicleServiceStatusHandler
  );
}
