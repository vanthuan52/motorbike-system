import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApiState } from "@/types/redux-common.type";
import { ENUM_STORE_STATUS, Store, StorePaginationQuery } from "../types";
import { ApiResponsePagination } from "@/types/api.type";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

interface storeState extends BaseApiState {
  stores: Store[];
  store: Store | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetStoreSuccessPayload {
  stores: Store[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: storeState = {
  stores: [],
  store: null,
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

export const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    getStore(state, action: PayloadAction<StorePaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getStoreSuccess(state, action: PayloadAction<GetStoreSuccessPayload>) {
      state.loadingList = false;
      state.stores = action.payload.stores;
      state.pagination = action.payload.pagination;
    },
    getStoreFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.stores = [];
      state.pagination = undefined;
    },
    getStoreDetail(state, action: PayloadAction<{ storeId: string }>) {
      state.loadingSingle = true;
      state.error = null;
    },
    getStoreDetailSuccess(state, action: PayloadAction<Store>) {
      state.loadingSingle = false;
      state.store = action.payload;
    },
    getStoreDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.store = null;
    },
    createStore(state, action: PayloadAction<{ store: Store }>) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createStoreSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createStoreFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },
    updateStore(
      state,
      action: PayloadAction<{ storeId: string; store: Store }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateStoreSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateStoreFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },
    deleteStore(state, action: PayloadAction<{ storeId: string }>) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteStoreSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteStoreFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },
    updateStoreStatus(
      state,
      action: PayloadAction<{
        storeId: string;
        status: ENUM_STORE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateStoreStatusSuccess(state) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;
    },
    updateStoreStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },
    resetStoreDetail(state) {
      state.loadingSingle = false;
      state.store = null;
      state.error = null;
    },
    resetState(state) {
      state.create = { loading: false, success: false };
      state.update = { loading: false, success: false };
      state.deletion = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
      state.loadingList = false;
      state.loadingSingle = false;
      state.stores = [];
      state.store = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const storeActions = storeSlice.actions;
export default storeSlice.reducer;
