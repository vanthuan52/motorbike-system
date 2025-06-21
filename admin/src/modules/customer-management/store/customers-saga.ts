import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { customerServices } from "../services/customers-api";
import { customersActions } from "./customers-slice";
import { ENUM_USER_STATUS, User } from "../types";
import { toast } from "react-toastify";

function* fetchCustomersHandler(
  action: PayloadAction<object>
): Generator<any, void, any> {
  try {
    const payload = action.payload;
    const data = yield call(customerServices.getCustomerList, payload);
    yield put(customersActions.fetchCustomersSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(customersActions.fetchCustomersFailure(message));
  }
}

function* fetchCustomerDetailHandler(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    const id = action.payload;
    const data = yield call(customerServices.getCustomerDetails, id);
    yield put(customersActions.fetchCustomerDetailSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(customersActions.fetchCustomerDetailFailure(message));
  }
}

function* createCustomerHandler(action: PayloadAction<{ customer: User }>) {
  try {
    const { customer } = action.payload;
    yield call(customerServices.createCustomer, customer);
    toast.success("Tạo khách hàng thành công");
    yield put(customersActions.createCustomerSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(customersActions.createCustomerFailure(message));
  }
}

function* updateCustomerHandler(
  action: PayloadAction<{ customer: User; id: string }>
) {
  try {
    const { customer, id } = action.payload;
    yield call(customerServices.updateCustomer, customer, id);
    toast.success("Cập nhật khách hàng thành công");
    yield put(customersActions.updateCustomerSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(customersActions.updateCustomerFailure(message));
  }
}

function* deleteCustomerHandler(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    yield call(customerServices.deleteCustomer, id);
    toast.success("Xóa khách hàng thành công");
    yield put(customersActions.deleteCustomerSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(customersActions.deleteCustomerFailure(message));
  }
}

function* updateCustomerStatusHandler(
  action: PayloadAction<{ id: string; status: ENUM_USER_STATUS }>
) {
  try {
    const { id, status } = action.payload;
    yield call(customerServices.updateCustomerStatus, id, status);
    toast.success("Cập nhật trạng thái khách hàng thành công");
    yield put(customersActions.updateCustomerSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(customersActions.updateCustomerFailure(message));
  }
}

export function* customersRootSaga() {
  yield takeLatest(
    customersActions.fetchCustomersRequest.type,
    fetchCustomersHandler
  );
  yield takeLatest(
    customersActions.fetchCustomerDetailRequest.type,
    fetchCustomerDetailHandler
  );
  yield takeLatest(
    customersActions.createCustomerRequest.type,
    createCustomerHandler
  );
  yield takeLatest(
    customersActions.updateCustomerRequest.type,
    updateCustomerHandler
  );
  yield takeLatest(
    customersActions.deleteCustomerRequest.type,
    deleteCustomerHandler
  );
  yield takeLatest(
    customersActions.updateCustomerStatusRequest.type,
    updateCustomerStatusHandler
  );
}
