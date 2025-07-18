import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApiState } from "@/types/redux-common.type";
import { ApiResponsePagination } from "@/types/api.type";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import {
  CareRecordChecklist,
  CareRecordChecklistPaginationQuery,
} from "../types";

interface CareRecordChecklistState extends BaseApiState {
  list: CareRecordChecklist[];
  detail: CareRecordChecklist | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetCareRecordChecklistSuccessPayload {
  CareRecordChecklists: CareRecordChecklist[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: CareRecordChecklistState = {
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

export const CareRecordChecklistSlice = createSlice({
  name: "CareRecordChecklists",
  initialState,
  reducers: {
    getCareRecordChecklists(
      state,
      action: PayloadAction<CareRecordChecklistPaginationQuery>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getCareRecordChecklistsSuccess(
      state,
      action: PayloadAction<GetCareRecordChecklistSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.CareRecordChecklists;
      state.pagination = action.payload.pagination;
    },
    getCareRecordChecklistsFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },
    getCareRecordChecklistDetail(
      state,
      action: PayloadAction<{ CareRecordChecklistId: string }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getCareRecordChecklistDetailSuccess(
      state,
      action: PayloadAction<CareRecordChecklist>
    ) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getCareRecordChecklistDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },
    createCareRecordChecklist(
      state,
      action: PayloadAction<{ CareRecordChecklist: CareRecordChecklist }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createCareRecordChecklistSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createCareRecordChecklistFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },
    updateCareRecordChecklist(
      state,
      action: PayloadAction<{
        CareRecordChecklistId: string;
        CareRecordChecklist: CareRecordChecklist;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateCareRecordChecklistSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateCareRecordChecklistFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },
    deleteCareRecordChecklist(
      state,
      action: PayloadAction<{ CareRecordChecklistId: string }>
    ) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteCareRecordChecklistSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteCareRecordChecklistFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },
    updateCareRecordChecklistStatus(
      state,
      action: PayloadAction<{
        CareRecordChecklistId: string;
        status: string;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateCareRecordChecklistStatusSuccess(
      state,
      action: PayloadAction<{
        CareRecordChecklistId: string;
        status: string;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
    },
    updateCareRecordChecklistStatusFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },
    resetCareRecordChecklistDetail(state) {
      state.loadingSingle = false;
      state.list = [];
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

export const CareRecordChecklistActions = CareRecordChecklistSlice.actions;
export default CareRecordChecklistSlice.reducer;
