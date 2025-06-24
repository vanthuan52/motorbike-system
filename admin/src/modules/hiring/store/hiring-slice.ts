import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ENUM_HIRING_STATUS, Hiring, HiringPaginationQuery } from "../types";
import { ApiResponsePagination } from "@/types/api.type";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

export interface HiringState {
  hiringList: Hiring[];
  hiringDetail: Hiring | null;
  loading: boolean;
  isUpserted: boolean;
  isDeleted: boolean;
  isStatusUpdated: boolean;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetHiringSuccessPayload {
  hiringList: Hiring[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: HiringState = {
  hiringList: [],
  hiringDetail: null,
  loading: false,
  isUpserted: false,
  isDeleted: false,
  isStatusUpdated: false,
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
};

export const hiringSlice = createSlice({
  name: "hiring",
  initialState,
  reducers: {
    getHiring(state, action: PayloadAction<HiringPaginationQuery>) {
      state.loading = true;
      state.error = null;
    },
    getHiringSuccess(state, action: PayloadAction<GetHiringSuccessPayload>) {
      state.loading = false;
      state.error = null;
      state.hiringList = action.payload.hiringList;
      state.pagination = action.payload.pagination;
    },
    getHiringFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.hiringList = [];
    },

    getHiringDetail(state, action: PayloadAction<{ hiringId: Hiring["_id"] }>) {
      state.loading = true;
      state.error = null;
      state.hiringDetail = null;
    },
    getHiringDetailSuccess(state, action: PayloadAction<Hiring>) {
      state.loading = false;
      state.error = null;
      state.hiringDetail = action.payload;
    },
    getHiringDetailFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.hiringDetail = null;
    },

    createHiring(state, action: PayloadAction<{ hiring: Hiring }>) {
      state.loading = true;
      state.error = null;
      state.isUpserted = false;
    },
    createHiringSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isUpserted = true;
    },
    createHiringFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isUpserted = false;
    },

    updateHiring(
      state,
      action: PayloadAction<{ hiringId: string; hiring: Hiring }>
    ) {
      state.loading = true;
      state.error = null;
      state.isUpserted = false;
    },
    updateHiringSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isUpserted = true;
    },
    updateHiringFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isUpserted = false;
    },

    deleteHiring(state, action: PayloadAction<{ hiringId: string }>) {
      state.loading = true;
      state.error = null;
      state.isDeleted = false;
    },
    deleteHiringSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isDeleted = true;
    },
    deleteHiringFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isDeleted = false;
    },

    updateHiringStatus(
      state,
      action: PayloadAction<{ hiringId: string; status: ENUM_HIRING_STATUS }>
    ) {
      state.loading = true;
      state.error = null;
      state.isStatusUpdated = false;
    },
    updateHiringStatusSuccess(state) {
      state.loading = false;
      state.error = null;
      state.isStatusUpdated = true;
    },
    updateHiringStatusFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isStatusUpdated = false;
    },
    resetHiringDetail(state) {
      state.loading = false;
      state.error = null;
      state.hiringDetail = null;
    },
    resetState(state) {
      state.loading = false;
      state.isUpserted = false;
      state.isDeleted = false;
      state.error = null;
      state.hiringList = [];
      state.hiringDetail = null;
      state.pagination = undefined;
    },
  },
});

export const hiringActions = hiringSlice.actions;
export default hiringSlice.reducer;
