import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApiState } from "@/types/redux-common.type";
import { ApiResponsePagination } from "@/types/api.type";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import {
  CareRecord,
  CareRecordPaginationQuery,
  ENUM_PAYMENT_STATUS,
} from "../types";

interface careRecordState extends BaseApiState {
  careRecords: CareRecord[];
  careRecord: CareRecord | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetCareRecordSuccessPayload {
  careRecords: CareRecord[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: careRecordState = {
  careRecords: [],
  careRecord: null,
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

export const careRecordSlice = createSlice({
  name: "careRecords",
  initialState,
  reducers: {
    getCareRecords(state, action: PayloadAction<CareRecordPaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getCareRecordsSuccess(
      state,
      action: PayloadAction<GetCareRecordSuccessPayload>
    ) {
      state.loadingList = false;
      state.careRecords = action.payload.careRecords;
      state.pagination = action.payload.pagination;
    },
    getCareRecordsFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.careRecords = [];
      state.pagination = undefined;
    },
    getCareRecordDetail(
      state,
      action: PayloadAction<{ careRecordId: string }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getCareRecordDetailSuccess(state, action: PayloadAction<CareRecord>) {
      state.loadingSingle = false;
      state.careRecord = action.payload;
    },
    getCareRecordDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.careRecord = null;
    },
    createCareRecord(state, action: PayloadAction<{ careRecord: CareRecord }>) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createCareRecordSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createCareRecordFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },
    updateCareRecord(
      state,
      action: PayloadAction<{ careRecordId: string; careRecord: CareRecord }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateCareRecordSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateCareRecordFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },
    deleteCareRecord(state, action: PayloadAction<{ careRecordId: string }>) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteCareRecordSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteCareRecordFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },
    updateCareRecordStatus(
      state,
      action: PayloadAction<{
        careRecordId: string;
        status: string;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateCareRecordStatusSuccess(
      state,
      action: PayloadAction<{
        careRecordId: string;
        status: string;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
    },
    updateCareRecordStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },
    updatePaymentStatus(
      state,
      action: PayloadAction<{
        careRecordId: string;
        paymentStatus: ENUM_PAYMENT_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updatePaymentStatusSuccess(state) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
    },
    updatePaymentStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    // ✅ Assign technician
    assignTechnician(
      state,
      action: PayloadAction<{
        careRecordId: string;
        technicianId: string;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    assignTechnicianSuccess(state) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
    },
    assignTechnicianFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    resetCareRecordDetail(state) {
      state.loadingSingle = false;
      state.careRecord = null;
      state.error = null;
    },
    resetState(state) {
      state.create = { loading: false, success: false };
      state.update = { loading: false, success: false };
      state.deletion = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
      state.loadingList = false;
      state.loadingSingle = false;
      state.careRecords = [];
      state.careRecord = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const careRecordActions = careRecordSlice.actions;
export default careRecordSlice.reducer;
