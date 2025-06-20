import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import employeesService from "../services/employeeService";
import { ApiResponse, EmployeeType } from "../types";
import { employeesActions } from "./employees-slice";
import { toast } from "react-toastify";

// Fetch list
function* fetchEmployeesHandler(action: PayloadAction<any>) {
  try {
    const payload = action.payload;
    const response: ApiResponse<{ employees: EmployeeType[]; total: number }> = yield call(
      employeesService.getEmployees,
      payload
    );
    yield put(employeesActions.fetchEmployeesSuccess(response.data));
  } catch (error: any) {
    toast.error("Lỗi khi tải danh sách nhân viên");
    yield put(employeesActions.fetchEmployeesFailure(error.message));
  }
}

// Fetch detail
function* fetchEmployeeDetailHandler(action: PayloadAction<string>) {
  try {
    const id = action.payload;
    const response: ApiResponse<{ employee: EmployeeType | null }> = yield call(
      employeesService.getEmployeeDetails,
      id
    );

    if (response.data.employee) {
      yield put(employeesActions.fetchEmployeeDetailSuccess(response.data.employee));
    } else {
      throw new Error("Không tìm thấy nhân viên");
    }
  } catch (error: any) {
    toast.error("Lỗi khi tải thông tin chi tiết nhân viên");
    yield put(employeesActions.fetchEmployeeDetailFailure(error.message));
  }
}

// Update
function* updateEmployeeHandler(action: PayloadAction<{ id: string; data: Partial<EmployeeType> }>) {
  try {
    const { id, data } = action.payload;
    const response: ApiResponse<{ employee: EmployeeType }> = yield call(
      employeesService.updateEmployee,
      id,
      data
    );
    toast.success("Cập nhật nhân viên thành công");
    yield put(employeesActions.updateEmployeeSuccess());
  } catch (error: any) {
    toast.error("Cập nhật nhân viên thất bại");
    yield put(employeesActions.updateEmployeeFailure(error.message));
  }
}


// Create
function* createEmployeeHandler(action: PayloadAction<{ employee: EmployeeType }>) {
  try {
    const { employee } = action.payload;
    yield call(employeesService.createEmployee, employee);
    toast.success("Thêm nhân viên thành công");
    yield put(employeesActions.createEmployeeSuccess());
  } catch (error: any) {
    toast.error("Thêm nhân viên thất bại");
    yield put(employeesActions.createEmployeeFailure(error.message));
  }
}

// Delete
function* deleteEmployeeHandler(action: PayloadAction<string>) {
  try {
    const id = action.payload;
    yield call(employeesService.deleteEmployee, id);
    toast.success("Xóa nhân viên thành công");
    yield put(employeesActions.deleteEmployeeSuccess());
  } catch (error: any) {
    toast.error("Xóa nhân viên thất bại");
    yield put(employeesActions.deleteEmployeeFailure(error.message));
  }
}

// Root saga
export function* employeesRootSaga() {
  yield takeLatest(employeesActions.fetchEmployeesRequest.type, fetchEmployeesHandler);
  yield takeLatest(employeesActions.fetchEmployeeDetailRequest.type, fetchEmployeeDetailHandler);
  yield takeLatest(employeesActions.updateEmployeeRequest.type, updateEmployeeHandler);
  yield takeLatest(employeesActions.createEmployeeRequest.type, createEmployeeHandler);
  yield takeLatest(employeesActions.deleteEmployeeRequest.type, deleteEmployeeHandler);
}
