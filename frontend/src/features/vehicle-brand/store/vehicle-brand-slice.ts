import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import { VehicleBrand, VehicleBrandPaginationQuery } from "../types";

interface VehicleBrandState extends BaseApiState {
  list: VehicleBrand[];
  detail: VehicleBrand | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetVehicleBrandSuccessPayload {
  list: VehicleBrand[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: VehicleBrandState = {
  list: [],
  detail: null,
  loadingList: false,
  loadingSingle: false,
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
  create: { loading: false, success: false },
  update: { loading: false, success: false },
  deletion: { loading: false, success: false },
  partialUpdate: { loading: false, success: false },
};

export const vehicleBrandSlice = createSlice({
  name: "vehicleBrand",
  initialState,
  reducers: {
    getVehicleBrands(
      state,
      action: PayloadAction<VehicleBrandPaginationQuery>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getVehicleBrandsSuccess(
      state,
      action: PayloadAction<GetVehicleBrandSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getVehicleBrandsFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getVehicleBrandDetail(
      state,
      action: PayloadAction<{ vehicleBrandSlug: VehicleBrand["slug"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getVehicleBrandDetailSuccess(state, action: PayloadAction<VehicleBrand>) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getVehicleBrandDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    resetVehicleBrandDetail(state) {
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

export const vehicleBrandActions = vehicleBrandSlice.actions;
export default vehicleBrandSlice.reducer;
