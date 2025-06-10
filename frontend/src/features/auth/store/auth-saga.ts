import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { authActions } from "./auth-slice";
import { LoginCredentials, UserAuthInfo } from "../types";
import authService from "../auth.service";
import userService from "@/features/user/user.service";
import { UserProfile } from "@/features/user/types";

function* loginCredentialsHandler(action: PayloadAction<LoginCredentials>) {
  try {
    const loginData: UserAuthInfo = yield call(
      authService.loginCredentials,
      action.payload
    );
    yield put(authActions.loginCredentialsSuccess());
    yield put(authActions.getUserProfile());
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

function* getProfileSaga() {
  try {
    const userProfile: UserProfile = yield call(userService.getProfile);
    console.log("user: ", userProfile);
    yield put(authActions.getUserProfileSuccess(userProfile));
  } catch (error: any) {
    yield put(authActions.getUserProfileFailure());
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginCredentials, loginCredentialsHandler);
  yield takeLatest(authActions.register, registerHandler);
  yield takeLatest(authActions.getUserProfile, getProfileSaga);
}
