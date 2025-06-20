import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeeType } from "../types";

interface EmployeesState {
  employees: EmployeeType[];
  total: number;
  isLoading: boolean;
  error: string | null;
  employeeDetail: EmployeeType | null;
  isDetailLoading: boolean;
  detailError: string | null;
}

const initialState: EmployeesState = {
  employees: [],
  total: 0,
  isLoading: false,
  error: null,
  employeeDetail: null,
  isDetailLoading: false,
  detailError: null,
};

export const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    // Fetch all
    fetchEmployeesRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchEmployeesSuccess(state, action) {
      state.isLoading = false;
      state.employees = action.payload.employee;
      state.total = action.payload.total;
      state.error = null;
    },
    fetchEmployeesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Fetch detail
    fetchEmployeeDetailRequest(state) {
      state.isDetailLoading = true;
      state.detailError = null;
      state.employeeDetail = null;
    },
    fetchEmployeeDetailSuccess(state, action) {
      state.isDetailLoading = false;
      state.employeeDetail = action.payload;
      state.detailError = null;
    },
    fetchEmployeeDetailFailure(state, action) {
      state.isDetailLoading = false;
      state.detailError = action.payload;
      state.employeeDetail = null;
    },

    // Update
    updateEmployeeRequest(state, action: PayloadAction<{ id: string; data: Partial<EmployeeType> }>) {
      state.error = null;
    },
    updateEmployeeSuccess(state) {
      state.error = null;
    },
    updateEmployeeFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // Create
    createEmployeeRequest(state) {
      state.error = null;
    },
    createEmployeeSuccess(state) {
      state.error = null;
    },
    createEmployeeFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // Delete
    deleteEmployeeRequest(state) {
      state.error = null;
    },
    deleteEmployeeSuccess(state) {
      state.error = null;
    },
    deleteEmployeeFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const employeesActions = employeesSlice.actions;
export default employeesSlice.reducer;
