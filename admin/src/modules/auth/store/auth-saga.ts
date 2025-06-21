import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { authActions } from "./auth-slice";
import { LoginCredentials } from "../types";
import { UserProfile } from "@/modules/user/types";
import authService from "../auth.service";
import { clearTokens } from "@/utils/jwt.uitls";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import userService from "@/modules/user/user.service";

function* loginCredentialsHandler(action: PayloadAction<LoginCredentials>) {
  try {
    yield call(authService.loginCredentials, action.payload);

    yield put(authActions.getUserProfile());
    yield put(
      notificationActions.notify({
        type: "success",
        message: "Đăng nhập thành công!",
      })
    );
    yield put(authActions.loginCredentialsSuccess());
  } catch (error: any) {
    yield put(
      authActions.loginCredentialsFailure(error.message || "Login failed")
    );
  }
}

function* getProfileHandler() {
  try {
    const userProfile: UserProfile = yield call(userService.getProfile);

    yield put(authActions.getUserProfileSuccess(userProfile));
  } catch (error: any) {
    yield put(authActions.getUserProfileFailure());
  }
}

function* logoutHandler() {
  try {
    clearTokens();
    yield put(
      notificationActions.notify({
        type: "success",
        message: "Đăng xuất thành công!",
      })
    );
    yield put(authActions.logoutSuccess());
  } catch {
    yield put(authActions.logoutFailure());
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginCredentials, loginCredentialsHandler);
  yield takeLatest(authActions.getUserProfile.type, getProfileHandler);
  yield takeLatest(authActions.logout, logoutHandler);
}
