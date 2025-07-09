import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  ENUM_VEHICLE_MODEL_STATUS,
  VehicleModel,
  VehicleModelPaginationQuery,
} from "../types";

interface VehicleModelState extends BaseApiState {
  list: VehicleModel[];
  detail: VehicleModel | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetVehicleModelSuccessPayload {
  list: VehicleModel[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: VehicleModelState = {
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

export const vehicleModelSlice = createSlice({
  name: "vehicleModel",
  initialState,
  reducers: {
    getVehicleModels(
      state,
      action: PayloadAction<VehicleModelPaginationQuery>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getVehicleModelsSuccess(
      state,
      action: PayloadAction<GetVehicleModelSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getVehicleModelsFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getVehicleModelDetail(
      state,
      action: PayloadAction<{ vehicleModelSlug: VehicleModel["slug"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getVehicleModelDetailSuccess(state, action: PayloadAction<VehicleModel>) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getVehicleModelDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    resetVehicleModelDetail(state) {
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

export const vehicleModelActions = vehicleModelSlice.actions;
export default vehicleModelSlice.reducer;
