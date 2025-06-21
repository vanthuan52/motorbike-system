import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types";
import { AsyncState } from "@/modules/category/store/categories-slice";

interface CustomersState {
  list: {
    data: User[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  detail: AsyncState<User | null>;
  create: AsyncState;
  update: AsyncState;
  remove: AsyncState;
  updateStatus: AsyncState;
}

const initialAsyncState: AsyncState = {
  loading: false,
  success: false,
  error: null,
};

const initialState: CustomersState = {
  list: {
    data: [],
    total: 0,
    loading: false,
    error: null,
  },
  detail: {
    ...initialAsyncState,
    data: null,
  },
  create: { ...initialAsyncState },
  update: { ...initialAsyncState },
  remove: { ...initialAsyncState },
  updateStatus: { ...initialAsyncState },
};

export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    fetchCustomersRequest(state, action) {
      state.list.loading = true;
      state.list.error = null;
    },
    fetchCustomersSuccess(state, action) {
      state.list.loading = false;
      state.list.total = action.payload._metadata.pagination.total;
      state.list.data = action.payload.data;
    },
    fetchCustomersFailure(state, action) {
      state.list.loading = false;
      state.list.error = action.payload;
    },
    fetchCustomerDetailRequest(state, action) {
      state.detail.loading = true;
      state.detail.error = null;
      state.detail.data = null;
    },
    fetchCustomerDetailSuccess(state, action) {
      state.detail.loading = false;
      state.detail.success = true;
      state.detail.data = action.payload;
    },
    fetchCustomerDetailFailure(state, action) {
      state.detail.loading = false;
      state.detail.error = action.payload;
    },

    //create
    createCustomerRequest(state) {
      state.create = { ...initialAsyncState, loading: true };
    },
    createCustomerSuccess(state) {
      state.create = { ...initialAsyncState, success: true };
    },
    createCustomerFailure(state, action) {
      state.create = { ...initialAsyncState, error: action.payload };
    },

    //update
    updateCustomerRequest(state) {
      state.update = { ...initialAsyncState, loading: true };
    },
    updateCustomerSuccess(state) {
      state.update = { ...initialAsyncState, success: true };
    },
    updateCustomerFailure(state, action) {
      state.update = { ...initialAsyncState, error: action.payload };
    },

    //delete
    deleteCustomerRequest(state, action) {
      state.remove = { ...initialAsyncState, loading: true };
    },
    deleteCustomerSuccess(state) {
      state.remove = { ...initialAsyncState, success: true };
    },
    deleteCustomerFailure(state, action) {
      state.remove = { ...initialAsyncState, error: action.payload };
    },

    //update status
    updateCustomerStatusRequest(state, action) {
      state.updateStatus = { ...initialAsyncState, loading: true };
    },
    updateCustomerStatusSuccess(state, action) {
      state.updateStatus = { ...initialAsyncState, success: true };
    },
    updateCustomerStatusFailure(state, action) {
      state.updateStatus = { ...initialAsyncState, error: action.payload };
    },

    //reset
    reset(state) {
      state.list = initialState.list;
      state.detail = initialState.detail;
      state.create = initialState.create;
      state.update = initialState.update;
      state.remove = initialState.remove;
      state.updateStatus = initialState.updateStatus;
    },
  },
});

export const customersActions = customersSlice.actions;
export default customersSlice.reducer;
