import { toast } from "react-toastify";
import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { LoginFormType } from "../schemas/auth-schema";
import authApi from "../services/auth-api";
import { ApiResponse, User } from "../types";
import { authActions } from "./auth-slice";

function* loginHandler(action: PayloadAction<LoginFormType>) {
  try {
    const { message }: ApiResponse<any> = yield call(
      authApi.login,
      action.payload
    );
    toast.success(message);
    yield put(authActions.loginSuccess());
  } catch (error: any) {
    yield put(authActions.loginFailure(error.message || "Login failed"));
  }
}

function* getCurrentUserHandler() {
  try {
    const { data }: ApiResponse<User> = yield call(authApi.getCurrentUser);
    yield put(authActions.getCurrentUserSuccess(data));
  } catch (error: any) {
    yield put(authActions.getCurrentUserFailure(error.message));
  }
}

export function* authSaga() {
  yield takeLatest(authActions.login, loginHandler);
  yield takeLatest(authActions.getCurrentUser, getCurrentUserHandler);
}
