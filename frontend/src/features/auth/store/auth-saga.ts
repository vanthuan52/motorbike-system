import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { authActions } from "./auth-slice";
import { LoginCredentials, RegisterCredentials } from "../types";
import authService from "../auth.service";
import userService from "@/features/user/user.service";
import { UserProfile } from "@/features/user/types";
import { clearTokens } from "@/utils/jwt.utils";
import { notificationActions } from "@/features/notification/store/notification-slice";

function* loginCredentialsHandler(action: PayloadAction<LoginCredentials>) {
  try {
    yield call(authService.loginCredentials, action.payload);

    yield put(
      notificationActions.notify({
        type: "success",
        message: "Login successfully",
      })
    );

    yield put(authActions.loginCredentialsSuccess());
    yield put(authActions.getUserProfile());
  } catch (error: any) {
    yield put(
      authActions.loginCredentialsFailure(error.message || "Login failed")
    );
  }
}

function* registerHandler(action: PayloadAction<RegisterCredentials>) {
  try {
    yield call(authService.register, action.payload);

    yield put(
      notificationActions.notify({
        type: "success",
        message: "Register successfully",
      })
    );
    yield put(authActions.registerSuccess());
  } catch (error: any) {
    yield put(authActions.registerFailure(error.message || "Register failed"));
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
    yield put(authActions.logoutSuccess());
  } catch {
    yield put(authActions.logoutFailure());
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginCredentials, loginCredentialsHandler);
  yield takeLatest(authActions.register, registerHandler);
  yield takeLatest(authActions.getUserProfile, getProfileHandler);
  yield takeLatest(authActions.logout, logoutHandler);
}
