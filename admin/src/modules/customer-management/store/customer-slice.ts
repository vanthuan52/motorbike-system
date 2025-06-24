import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import {
  ENUM_USER_STATUS,
  User,
  UserPaginationQuery,
} from "@/modules/user/types";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";

interface CustomerState extends BaseApiState {
  users: User[];
  user: User | null;
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
  loadingList: false,
  loadingSingle: false,
  create: {
    loading: false,
    success: false,
  },
  update: {
    loading: false,
    success: false,
  },
  deletion: {
    loading: false,
    success: false,
  },
  partialUpdate: {
    loading: false,
    success: false,
  },
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    getCustomers(state, action: PayloadAction<UserPaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getCustomersSuccess(
      state,
      action: PayloadAction<GetCustomersSuccessPayload>
    ) {
      state.loadingList = false;
      state.error = null;
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
    },
    getCustomersFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.users = [];
      state.pagination = undefined;
    },
    getCustomerDetail(
      state,
      action: PayloadAction<{ customerId: User["_id"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getCustomerDetailSuccess(state, action: PayloadAction<User>) {
      state.loadingSingle = false;
      state.error = null;
      state.user = action.payload;
    },
    getCustomerDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.user = null;
    },

    createCustomer(state, action: PayloadAction<{ customer: User }>) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createCustomerSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
      state.error = null;
    },
    createCustomerFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateCustomer(
      state,
      action: PayloadAction<{ customerId: string; customer: User }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateCustomerSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
      state.error = null;
    },
    updateCustomerFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteCustomer(state, action: PayloadAction<{ customerId: string }>) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteCustomerSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
      state.error = null;
    },
    deleteCustomerFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    updateCustomerStatus(
      state,
      action: PayloadAction<{ customerId: string; status: ENUM_USER_STATUS }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateCustomerStatusSuccess(state) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;
    },
    updateCustomerStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    updateCustomerDetail: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = { ...action.payload };
      }
    },

    resetCustomerDetail(state) {
      state.loadingSingle = false;
      state.user = null;
      state.error = null;
    },

    resetState(state) {
      state.create = { loading: false, success: false };
      state.update = { loading: false, success: false };
      state.deletion = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
      state.loadingList = false;
      state.loadingSingle = false;
      state.users = [];
      state.user = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;
