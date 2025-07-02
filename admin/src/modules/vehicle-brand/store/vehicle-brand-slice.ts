import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  ENUM_VEHICLE_BRAND_STATUS,
  VehicleBrand,
  VehicleBrandPaginationQuery,
} from "../types";

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
      action: PayloadAction<{ vehicleBrandId: VehicleBrand["_id"] }>
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

    createVehicleBrand(
      state,
      action: PayloadAction<{ vehicleBrand: VehicleBrand }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createVehicleBrandSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createVehicleBrandFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateVehicleBrand(
      state,
      action: PayloadAction<{
        vehicleBrandId: string;
        vehicleBrand: VehicleBrand;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateVehicleBrandSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateVehicleBrandFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteVehicleBrand(
      state,
      action: PayloadAction<{ vehicleBrandId: string }>
    ) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteVehicleBrandSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteVehicleBrandFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    updateVehicleBrandStatus(
      state,
      action: PayloadAction<{
        vehicleBrandId: string;
        status: ENUM_VEHICLE_BRAND_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateVehicleBrandStatusSuccess(
      state,
      action: PayloadAction<{
        vehicleBrandId: string;
        status: ENUM_VEHICLE_BRAND_STATUS;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;

      const { vehicleBrandId, status } = action.payload;
      const index = state.list.findIndex(
        (vehicleBrand: VehicleBrand) => vehicleBrand._id === vehicleBrandId
      );
      if (index !== -1) {
        state.list[index].status = status;
      }
    },
    updateVehicleBrandStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
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
