import { PaginationQuery } from "@/types/base.type";
import { PayloadAction } from "@reduxjs/toolkit";
import userService from "../user.service";
import { UserListResponse } from "../types";
import { call, put, takeLatest } from "redux-saga/effects";
import { userActions } from "./user-slice";
import { notificationActions } from "@/features/notification/store/notification-slice";

function* getAdminTechniciansHandler(action: PayloadAction<PaginationQuery>) {
  try {
    const response: UserListResponse = yield call(
      userService.getListAdminTechnicians,
      action.payload
    );
    const users = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      userActions.getAdminTechniciansSuccess({
        users: users ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const errorMessage = error.message || "Lấy danh sách khách hàng thất bại!";
    yield put(userActions.getAdminTechniciansFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}
export function* userSaga() {
  yield takeLatest(userActions.getAdminTechnicians, getAdminTechniciansHandler);
}
