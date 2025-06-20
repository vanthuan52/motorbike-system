import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import vehicleCompanyService from "../service/vehicleCompanyService";
import { VehicleCompanyTypes, ApiResponse } from "../types";
import { vehicleCompanyActions } from "./vehicleCompany-slice";
import { toast } from "react-toastify";

// Fetch List
function* fetchCompaniesWorker() {
  try {
    const response: ApiResponse<VehicleCompanyTypes[]> = yield call(vehicleCompanyService.getAll);
    yield put(vehicleCompanyActions.fetchCompaniesSuccess(response.data));
  } catch (error: any) {
    yield put(vehicleCompanyActions.fetchCompaniesFailure("Lỗi tải danh sách hãng xe"));
    toast.error("Không thể tải danh sách hãng xe");
  }
}

// Create
function* createCompanyWorker(action: PayloadAction<Omit<VehicleCompanyTypes, "id">>) {
  try {
    yield call(vehicleCompanyService.create, action.payload);
    yield put(vehicleCompanyActions.operationSuccess());
    yield put(vehicleCompanyActions.fetchCompaniesRequest());
    toast.success("Tạo hãng xe thành công");
  } catch (error: any) {
    yield put(vehicleCompanyActions.operationFailure("Lỗi tạo hãng xe"));
    toast.error("Không thể tạo hãng xe");
  }
}

// Update
function* updateCompanyWorker(
  action: PayloadAction<{ id: string; data: Omit<VehicleCompanyTypes, "id"> }>
) {
  try {
    yield call(vehicleCompanyService.update, action.payload.id, action.payload.data);
    yield put(vehicleCompanyActions.operationSuccess());
    yield put(vehicleCompanyActions.fetchCompaniesRequest());
    toast.success("Cập nhật hãng xe thành công");
  } catch (error: any) {
    yield put(vehicleCompanyActions.operationFailure("Lỗi cập nhật hãng xe"));
    toast.error("Không thể cập nhật hãng xe");
  }
}

// Delete
function* deleteCompanyWorker(action: PayloadAction<string>) {
  try {
    yield call(vehicleCompanyService.remove, action.payload);
    yield put(vehicleCompanyActions.operationSuccess());
    yield put(vehicleCompanyActions.fetchCompaniesRequest());
    toast.success("Xóa hãng xe thành công");
  } catch (error: any) {
    yield put(vehicleCompanyActions.operationFailure("Lỗi xóa hãng xe"));
    toast.error("Không thể xóa hãng xe");
  }
}

// Root saga
export function* vehicleCompanyRootSaga() {
  yield takeLatest(vehicleCompanyActions.fetchCompaniesRequest.type, fetchCompaniesWorker);
  yield takeLatest(vehicleCompanyActions.createCompanyRequest.type, createCompanyWorker);
  yield takeLatest(vehicleCompanyActions.updateCompanyRequest.type, updateCompanyWorker);
  yield takeLatest(vehicleCompanyActions.deleteCompanyRequest.type, deleteCompanyWorker);
}
