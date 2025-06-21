import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { User, UserPaginationQuery } from "@/modules/user/types";
import { ApiResponsePagination } from "@/types/api.type";

interface CustomerState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetCustomersSuccessPayload {
  users: User[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: CustomerState = {
  users: [],
  user: null,
  loading: false,
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    getCustomers(state, action: PayloadAction<UserPaginationQuery>) {
      state.loading = true;
      state.error = null;
    },
    getCustomersSuccess(
      state,
      action: PayloadAction<GetCustomersSuccessPayload>
    ) {
      state.loading = false;
      state.error = null;
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
    },
    getCustomersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.users = [];
    },
    getCustomerDetail(
      state,
      action: PayloadAction<{ customerId: User["_id"] }>
    ) {
      state.loading = true;
      state.error = null;
    },
    getCustomerDetailSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    },
    getCustomerDetailFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },

    createCustomer(state, action: PayloadAction<{ customer: User }>) {
      state.loading = true;
      state.error = null;
    },
    createCustomerSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    createCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateCustomer(
      state,
      action: PayloadAction<{ customerId: string; customer: User }>
    ) {
      state.loading = true;
      state.error = null;
    },
    updateCustomerSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    updateCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteCustomer(state, action: PayloadAction<{ customerId: string }>) {
      state.loading = true;
      state.error = null;
    },
    deleteCustomerSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    deleteCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateCustomerStatus(state, action: PayloadAction<{ customerId: string }>) {
      state.loading = true;
      state.error = null;
    },
    updateCustomerStatusSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    updateCustomerStatusFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    reset(state) {
      state.loading = false;
      state.users = [];
      state.user = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;
