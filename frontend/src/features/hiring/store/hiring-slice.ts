import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hiring } from "../types";
import { ApiResponsePagination } from "@/types/api.type";

interface HiringState {
  hiringList: Hiring[];
  hiringDetail: Hiring | null;
  loading: boolean;
  isUpserted: boolean;
  isDeleted: boolean;
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
  error: null,
  pagination: undefined,
};

export const hiringSlice = createSlice({
  name: "hiring",
  initialState,
  reducers: {
    getHiringList(state, action: PayloadAction<object>) {
      state.loading = true;
      state.error = null;
    },
    getHiringListSuccess(
      state,
      action: PayloadAction<GetHiringSuccessPayload>
    ) {
      state.loading = false;
      state.error = null;
      state.hiringList = action.payload.hiringList;
      state.pagination = action.payload.pagination;
    },
    getHiringListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.hiringList = [];
    },

    getHiringDetail(state, action: PayloadAction<{ hiringId: Hiring["_id"] }>) {
      state.loading = true;
      state.error = null;
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

    reset(state) {
      state.loading = false;
      state.isUpserted = false;
      state.isDeleted = false;
      state.hiringList = [];
      state.hiringDetail = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const hiringActions = hiringSlice.actions;
export default hiringSlice.reducer;
