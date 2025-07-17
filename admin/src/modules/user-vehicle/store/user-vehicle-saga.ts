import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { UserVehicleActions } from "./user-vehicle-slice";
import {
  UserVehicle,
  UserVehicleCreationResponse,
  UserVehicleDeleteResponse,
  UserVehicleDetailResponse,
  UserVehicleListResponse,
  UserVehiclePaginationQuery,
  UserVehicleUpdateResponse,
  UserVehicleUpdateStatusResponse,
} from "../types";
import UserVehicleService from "../services/user-vehicle.service";

function* getUserVehicleListHandler(
  action: PayloadAction<UserVehiclePaginationQuery>
) {
  try {
    const response: UserVehicleListResponse = yield call(
      UserVehicleService.getUserVehicleList,
      action.payload
    );

    const UserVehicles = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      UserVehicleActions.getUserVehiclesSuccess({
        list: UserVehicles ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách dịch vụ thất bại!";
    yield put(UserVehicleActions.getUserVehiclesFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getUserVehicleDetailHandler(
  action: PayloadAction<{ userVehicleId: UserVehicle["_id"] }>
) {
  try {
    const { userVehicleId } = action.payload;
    const response: UserVehicleDetailResponse = yield call(
      UserVehicleService.getUserVehicleDetail,
      userVehicleId
    );
    const detail = response.data;
    yield put(UserVehicleActions.getUserVehicleDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết dịch vụ thất bại!";
    yield put(UserVehicleActions.getUserVehicleDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createUserVehicleHandler(
  action: PayloadAction<{ userVehicle: UserVehicle }>
) {
  try {
    const { userVehicle } = action.payload;
    const response: UserVehicleCreationResponse = yield call(
      UserVehicleService.createUserVehicle,
      userVehicle
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(UserVehicleActions.createUserVehicleSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(UserVehicleActions.createUserVehicleFailure(message));
  }
}

function* updateUserVehicleHandler(
  action: PayloadAction<{
    userVehicleId: string;
    UserVehicle: UserVehicle;
  }>
) {
  try {
    const { userVehicleId, UserVehicle } = action.payload;
    const response: UserVehicleUpdateResponse = yield call(
      UserVehicleService.updateUserVehicle,
      userVehicleId,
      UserVehicle
    );

    yield put(UserVehicleActions.updateUserVehicleSuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(
      UserVehicleActions.getUserVehicleDetail({ userVehicleId: userVehicleId })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(UserVehicleActions.updateUserVehicleFailure(message));
  }
}

function* deleteUserVehicleHandler(
  action: PayloadAction<{ userVehicleId: UserVehicle["_id"] }>
) {
  try {
    const { userVehicleId } = action.payload;
    const response: UserVehicleDeleteResponse = yield call(
      UserVehicleService.deleteUserVehicle,
      userVehicleId
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
    yield put(UserVehicleActions.deleteUserVehicleSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(UserVehicleActions.deleteUserVehicleFailure(message));
  }
}

export function* UserVehicleSaga() {
  yield takeLatest(
    UserVehicleActions.getUserVehicles,
    getUserVehicleListHandler
  );
  yield takeLatest(
    UserVehicleActions.getUserVehicleDetail,
    getUserVehicleDetailHandler
  );
  yield takeLatest(
    UserVehicleActions.createUserVehicle,
    createUserVehicleHandler
  );
  yield takeLatest(
    UserVehicleActions.updateUserVehicle,
    updateUserVehicleHandler
  );
  yield takeLatest(
    UserVehicleActions.deleteUserVehicle,
    deleteUserVehicleHandler
  );
}
