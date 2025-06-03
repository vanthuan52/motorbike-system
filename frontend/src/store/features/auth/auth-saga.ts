import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { authActions } from "./auth-slice";

function* loginHandler(action: PayloadAction<any>) {
  try {
    // Put something here
    yield put(authActions.loginSuccess());
  } catch (error: any) {
    yield put(authActions.loginFailure(error.message || "Login failed"));
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

export function* authSaga() {
  yield takeLatest(authActions.login, loginHandler);
  yield takeLatest(authActions.register, registerHandler);
}
