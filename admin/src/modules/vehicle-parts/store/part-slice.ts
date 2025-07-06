import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import { ENUM_PART_STATUS, VehiclePart, PartPaginationQuery } from "../types";

interface partState extends BaseApiState {
  list: VehiclePart[];
  detail: VehiclePart | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetPartSuccessPayload {
  list: VehiclePart[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: partState = {
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

export const partSlice = createSlice({
  name: "part",
  initialState,
  reducers: {
    getPart(state, action: PayloadAction<PartPaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getPartSuccess(state, action: PayloadAction<GetPartSuccessPayload>) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getPartFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getPartDetail(state, action: PayloadAction<{ partId: string }>) {
      state.loadingSingle = true;
      state.error = null;
    },
    getPartDetailSuccess(state, action: PayloadAction<VehiclePart>) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getPartDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    createPart(state, action: PayloadAction<{ part: VehiclePart }>) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createPartSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createPartFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updatePart(
      state,
      action: PayloadAction<{ partId: string; part: VehiclePart }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updatePartSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updatePartFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deletePart(state, action: PayloadAction<{ partId: string }>) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deletePartSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deletePartFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    updatePartStatus(
      state,
      action: PayloadAction<{
        partId: string;
        status: ENUM_PART_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updatePartStatusSuccess(
      state,
      action: PayloadAction<{
        partId: string;
        status: ENUM_PART_STATUS;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;
    },
    updatePartStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    resetPartDetail(state) {
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

export const vehiclePartActions = partSlice.actions;
export default partSlice.reducer;
