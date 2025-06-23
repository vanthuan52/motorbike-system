import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import {
  ENUM_USER_STATUS,
  User,
  UserPaginationQuery,
} from "@/modules/user/types";
import { ApiResponsePagination } from "@/types/api.type";

interface CustomerState {
  users: User[];
  user: User | null;
  loading: boolean;
  isUpserted: boolean;
  isDeleted: boolean;
  isStatusUpdated: boolean;
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
  isUpserted: false,
  isDeleted: false,
  isStatusUpdated: false,
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
      state.isUpserted = false;
    },
    createCustomerSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isUpserted = true;
    },
    createCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isUpserted = false;
    },

    updateCustomer(
      state,
      action: PayloadAction<{ customerId: string; customer: User }>
    ) {
      state.loading = true;
      state.error = null;
      state.isUpserted = false;
    },
    updateCustomerSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isUpserted = true;
    },
    updateCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isUpserted = false;
    },

    deleteCustomer(state, action: PayloadAction<{ customerId: string }>) {
      state.loading = true;
      state.error = null;
      state.isDeleted = false;
    },
    deleteCustomerSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isDeleted = true;
    },
    deleteCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isDeleted = false;
    },

    updateCustomerStatus(
      state,
      action: PayloadAction<{ customerId: string; status: ENUM_USER_STATUS }>
    ) {
      state.loading = true;
      state.error = null;
      state.isStatusUpdated = false;
    },
    updateCustomerStatusSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isStatusUpdated = true;
    },
    updateCustomerStatusFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isStatusUpdated = false;
    },

    updateCustomerDetail: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = { ...action.payload };
      }
    },

    resetCustomerDetail(state) {
      state.loading = false;
      state.user = null;
      state.error = null;
    },

    resetState(state) {
      state.loading = false;
      state.isUpserted = false;
      state.isDeleted = false;
      state.isStatusUpdated = false;
      state.users = [];
      state.user = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;
