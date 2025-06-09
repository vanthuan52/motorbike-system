import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { authActions } from "./auth-slice";
import { LoginCredentials, UserAuthInfo } from "../types";
import authService from "../auth.service";
import localStorageHelper from "@/utils/local-storage.helper";
import {
  ACCESS_TOKEN_EXPIRES_IN_KEY,
  ACCESS_TOKEN_KEY,
  IS_AUTHENTICATED_KEY,
  REFRESH_TOKEN_KEY,
} from "@/constant/constant";
import userService from "@/features/user/user.service";
import { User } from "@/features/user/types";

function* loginCredentialsHandler(action: PayloadAction<LoginCredentials>) {
  try {
    const userData: UserAuthInfo = yield call(
      authService.loginCredentials,
      action.payload
    );
    localStorageHelper.setItem(ACCESS_TOKEN_KEY, userData.accessToken);
    localStorageHelper.setItem(
      ACCESS_TOKEN_EXPIRES_IN_KEY,
      userData.expiresIn.toString()
    );
    localStorageHelper.setItem(REFRESH_TOKEN_KEY, userData.refreshToken);
    localStorageHelper.setItem(IS_AUTHENTICATED_KEY, "true");

    yield put(authActions.loginCredentialsSuccess());
  } catch (error: any) {
    yield put(
      authActions.loginCredentialsFailure(error.message || "Login failed")
    );
  }
}

function* registerHandler(action: PayloadAction<any>) {
  try {
    // Put something here
    yield put(authActions.registerSuccess());
  } catch (error: any) {
    yield put(authActions.registerFailure(error.message || "Register failed"));
  }
}

function* rehydrateSaga() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) throw new Error("No token found");

    const response: User = yield call(userService.getProfile);
    yield put(authActions.rehydrateSuccess({ user: response }));
  } catch (error) {
    localStorageHelper.removeItem(ACCESS_TOKEN_KEY);
    localStorageHelper.removeItem(REFRESH_TOKEN_KEY);
    yield put(authActions.rehydrateFailure());
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginCredentials, loginCredentialsHandler);
  yield takeLatest(authActions.register, registerHandler);
  yield takeLatest(authActions.rehydrateAuth.type, rehydrateSaga);
}
