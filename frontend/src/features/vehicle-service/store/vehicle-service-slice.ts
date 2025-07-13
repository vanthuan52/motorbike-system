import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import { VehicleService, VehicleServicePaginationQuery } from "../types";

interface VehicleServiceState extends BaseApiState {
  list: VehicleService[];
  detail: VehicleService | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetVehicleServiceSuccessPayload {
  list: VehicleService[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: VehicleServiceState = {
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

export const vehicleServiceSlice = createSlice({
  name: "vehicleService",
  initialState,
  reducers: {
    getVehicleServices(
      state,
      action: PayloadAction<VehicleServicePaginationQuery>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getVehicleServicesSuccess(
      state,
      action: PayloadAction<GetVehicleServiceSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getVehicleServicesFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getVehicleServiceDetail(
      state,
      action: PayloadAction<{ vehicleServiceSlug: VehicleService["slug"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getVehicleServiceDetailSuccess(
      state,
      action: PayloadAction<VehicleService>
    ) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getVehicleServiceDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    resetVehicleServiceDetail(state) {
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

export const vehicleServiceActions = vehicleServiceSlice.actions;
export default vehicleServiceSlice.reducer;
