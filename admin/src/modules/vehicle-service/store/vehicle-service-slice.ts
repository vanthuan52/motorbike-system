import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  ENUM_VEHICLE_SERVICE_STATUS,
  VehicleService,
  VehicleServicePaginationQuery,
} from "../types";

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
      action: PayloadAction<{ vehicleServiceId: VehicleService["_id"] }>
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

    createVehicleService(
      state,
      action: PayloadAction<{ vehicleService: VehicleService }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createVehicleServiceSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createVehicleServiceFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateVehicleService(
      state,
      action: PayloadAction<{
        vehicleServiceId: string;
        vehicleService: VehicleService;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateVehicleServiceSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateVehicleServiceFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteVehicleService(
      state,
      action: PayloadAction<{ vehicleServiceId: string }>
    ) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteVehicleServiceSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteVehicleServiceFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    updateVehicleServiceStatus(
      state,
      action: PayloadAction<{
        vehicleServiceId: string;
        status: ENUM_VEHICLE_SERVICE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateVehicleServiceStatusSuccess(
      state,
      action: PayloadAction<{
        vehicleServiceId: string;
        status: ENUM_VEHICLE_SERVICE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;

      const { vehicleServiceId, status } = action.payload;
      const index = state.list.findIndex(
        (vehicleService) => vehicleService._id === vehicleServiceId
      );
      if (index !== -1) {
        state.list[index].status = status;
      }
    },
    updateVehicleServiceStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
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
