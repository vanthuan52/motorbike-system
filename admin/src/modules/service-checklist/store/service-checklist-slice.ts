import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import { ServiceChecklist, ServiceChecklistPaginationQuery } from "../types";

interface ServiceChecklistState extends BaseApiState {
  list: ServiceChecklist[];
  detail: ServiceChecklist | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetServiceChecklistSuccessPayload {
  list: ServiceChecklist[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: ServiceChecklistState = {
  list: [],
  detail: null,
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

export const serviceChecklistSlice = createSlice({
  name: "serviceChecklist",
  initialState,
  reducers: {
    getServiceChecklistList(
      state,
      action: PayloadAction<ServiceChecklistPaginationQuery>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getServiceChecklistListSuccess(
      state,
      action: PayloadAction<GetServiceChecklistSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getServiceChecklistListFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getServiceChecklistDetail(
      state,
      action: PayloadAction<{ serviceChecklistId: ServiceChecklist["_id"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getServiceChecklistDetailSuccess(
      state,
      action: PayloadAction<ServiceChecklist>
    ) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getServiceChecklistDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    createServiceChecklist(
      state,
      action: PayloadAction<{ serviceChecklist: ServiceChecklist }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createServiceChecklistSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createServiceChecklistFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateServiceChecklist(
      state,
      action: PayloadAction<{
        serviceChecklistId: string;
        serviceChecklist: ServiceChecklist;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateServiceChecklistSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateServiceChecklistFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteServiceChecklist(
      state,
      action: PayloadAction<{ serviceChecklistId: string }>
    ) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteServiceChecklistSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteServiceChecklistFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    resetServiceChecklistDetail(state) {
      state.loadingSingle = false;
      state.detail = null;
      state.error = null;
    },

    resetState(state) {
      state.create = { loading: false, success: false };
      state.update = { loading: false, success: false };
      state.deletion = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
      state.loadingList = false;
      state.loadingSingle = false;
      state.list = [];
      state.detail = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const serviceChecklistActions = serviceChecklistSlice.actions;
export default serviceChecklistSlice.reducer;
