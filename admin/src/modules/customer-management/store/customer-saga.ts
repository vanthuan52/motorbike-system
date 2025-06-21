import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import customerServices from "../customer.service";
import { customerActions } from "./customer-slice";
import {
  ENUM_USER_STATUS,
  User,
  UserCreationResponse,
  UserDetailResponse,
} from "@/modules/user/types";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { UserPaginationQuery, UserListResponse } from "@/modules/user/types";

function* getCustomersHandler(action: PayloadAction<UserPaginationQuery>) {
  try {
    const response: UserListResponse = yield call(
      customerServices.getCustomers,
      action.payload
    );
    const users = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      customerActions.getCustomersSuccess({
        users: users ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const errorMessage = error.message || "Lấy danh sách khách hàng thất bại!";
    yield put(customerActions.getCustomersFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

function* getCustomerDetailHandler(
  action: PayloadAction<{ customerId: User["_id"] }>
) {
  try {
    const { customerId } = action.payload;
    const response: UserDetailResponse = yield call(
      customerServices.getCustomerDetail,
      customerId
    );
    const user = response.data;

    yield put(customerActions.getCustomerDetailSuccess(user!));
  } catch (error: any) {
    const errorMessage = error.message || "Lấy danh sách khách hàng thất bại!";
    yield put(customerActions.getCustomerDetailFailure(errorMessage));
  }
}

function* createCustomerHandler(action: PayloadAction<{ customer: User }>) {
  try {
    const { customer } = action.payload;
    const response: UserCreationResponse = yield call(
      customerServices.createCustomer,
      customer
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(customerActions.createCustomerSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(customerActions.createCustomerFailure(message));
  }
}

// function* updateCustomerHandler(
//   action: PayloadAction<{ customerId: string; customer: User }>
// ) {
//   try {
//     const { customer, customerId } = action.payload;
//     yield call(customerServices.updateCustomer, customerId, customer);
//     yield put(
//       notificationActions.notify({
//         type: "info",
//         message: "Cập nhật thành công!",
//       })
//     );
//     yield put(customerActions.updateCustomerSuccess());
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : String(error);
//     yield put(customerActions.updateCustomerFailure(message));
//   }
// }

// function* deleteCustomerHandler(action: PayloadAction<{ id: string }>) {
//   try {
//     const { id } = action.payload;
//     yield call(customerServices.deleteCustomer, id);
//     yield put(
//       notificationActions.notify({
//         type: "info",
//         message: "Xóa thành công!",
//       })
//     );
//     yield put(customerActions.deleteCustomerSuccess());
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : String(error);
//     yield put(customerActions.deleteCustomerFailure(message));
//   }
// }

// function* updateCustomerStatusHandler(
//   action: PayloadAction<{ id: string; status: ENUM_USER_STATUS }>
// ) {
//   try {
//     const { id, status } = action.payload;
//     yield call(customerServices.updateCustomerStatus, id, status);
//     yield put(
//       notificationActions.notify({
//         type: "info",
//         message: "Cập nhật thành công!",
//       })
//     );
//     yield put(customerActions.updateCustomerSuccess());
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : String(error);
//     yield put(customerActions.updateCustomerFailure(message));
//   }
// }

export function* customerSaga() {
  yield takeLatest(customerActions.getCustomers, getCustomersHandler);
  yield takeLatest(customerActions.getCustomerDetail, getCustomerDetailHandler);
  yield takeLatest(customerActions.createCustomer, createCustomerHandler);
  // yield takeLatest(customerActions.updateCustomer, updateCustomerHandler);
  // yield takeLatest(customerActions.deleteCustomer, deleteCustomerHandler);
  // yield takeLatest(
  //   customerActions.updateCustomerStatus,
  //   updateCustomerStatusHandler
  // );
}
