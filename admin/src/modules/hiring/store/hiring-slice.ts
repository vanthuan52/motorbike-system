import { AsyncState } from "@/modules/category/store/categories-slice";
import { Hiring } from "../types";
import { createSlice } from "@reduxjs/toolkit";

interface HiringState {
  list: {
    data: Hiring[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  detail: AsyncState<Hiring | null>;
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
const initialState: HiringState = {
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

export const hiringSlice = createSlice({
  name: "hiring",
  initialState,
  reducers: {
    fetchHiringRequest(state, action) {
      state.list.loading = true;
      state.list.error = null;
    },
    fetchHiringSuccess(state, action) {
      state.list.loading = false;
      state.list.data = action.payload.data;
      state.list.total = action.payload._metadata.pagination.total;
    },
    fetchHiringFailure(state, action) {
      state.list.loading = false;
      state.list.error = action.payload;
    },

    fetchHiringDetailRequest(state, action) {
      state.detail.loading = true;
      state.detail.error = null;
      state.detail.data = null;
    },
    fetchHiringDetailSuccess(state, action) {
      state.detail.loading = false;
      state.detail.success = true;
      state.detail.data = action.payload;
    },
    fetchHiringDetailFailure(state, action) {
      state.detail.loading = false;
      state.detail.error = action.payload;
    },

    createHiringRequest(state, action) {
      state.create = { ...initialAsyncState, loading: true };
    },
    createHiringSuccess(state) {
      state.create = { ...initialAsyncState, success: true };
    },
    createHiringFailure(state, action) {
      state.create = { ...initialAsyncState, error: action.payload };
    },

    updateHiringRequest(state, action) {
      state.update = { ...initialAsyncState, loading: true };
    },
    updateHiringSuccess(state) {
      state.update = { ...initialAsyncState, success: true };
    },
    updateHiringFailure(state, action) {
      state.update = { ...initialAsyncState, error: action.payload };
    },

    deleteHiringRequest(state, action) {
      state.remove = { ...initialAsyncState, loading: true };
    },
    deleteHiringSuccess(state) {
      state.remove = { ...initialAsyncState, success: true };
    },
    deleteHiringFailure(state, action) {
      state.remove = { ...initialAsyncState, error: action.payload };
    },

    updateStatusHiringRequest(state, action) {
      state.updateStatus = { ...initialAsyncState, loading: true };
    },
    updateStatusHiringSuccess(state, action) {
      state.updateStatus = { ...initialAsyncState, success: true };
    },
    updateStatusHiringFailure(state, action) {
      state.updateStatus = { ...initialAsyncState, error: action.payload };
    },
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

export const hiringActions = hiringSlice.actions;
export default hiringSlice.reducer;
