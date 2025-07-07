import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  ServicePrice,
  ServicePricePaginationQuery,
  ModelServicePrice,
  ModelServicePricePaginationQuery,
} from "../types";

interface ServicePriceState extends BaseApiState {
  list: ServicePrice[];
  listForService: ModelServicePrice[];
  listHistory: ServicePrice[];
  detail: ServicePrice | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetServicePriceListSuccessPayload {
  list: ServicePrice[];
  pagination: ApiResponsePagination | undefined;
}

interface GetServicePriceListForServiceSuccessPayload {
  list: ModelServicePrice[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: ServicePriceState = {
  list: [],
  listForService: [],
  listHistory: [],
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

export const servicePriceSlice = createSlice({
  name: "servicePrice",
  initialState,
  reducers: {
    getServicePrices(
      state,
      action: PayloadAction<ServicePricePaginationQuery>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getServicePricesSuccess(
      state,
      action: PayloadAction<GetServicePriceListSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getServicePricesFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getServicePriceDetail(
      state,
      action: PayloadAction<{ servicePriceId: ServicePrice["_id"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getServicePriceDetailSuccess(state, action: PayloadAction<ServicePrice>) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getServicePriceDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    createServicePrice(
      state,
      action: PayloadAction<{ servicePrice: ServicePrice }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createServicePriceSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createServicePriceFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateServicePrice(
      state,
      action: PayloadAction<{
        servicePriceId: string;
        servicePrice: ServicePrice;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateServicePriceSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateServicePriceFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteServicePrice(
      state,
      action: PayloadAction<{ servicePriceId: string }>
    ) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteServicePriceSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteServicePriceFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    resetServicePriceDetail(state) {
      state.loadingSingle = false;
      state.detail = null;
      state.error = null;
    },

    getModelServicePrices(
      state,
      action: PayloadAction<{
        vehicleServiceId: string;
        query: ModelServicePricePaginationQuery;
      }>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getModelServicePricesSuccess(
      state,
      action: PayloadAction<GetServicePriceListForServiceSuccessPayload>
    ) {
      state.loadingList = false;
      state.listForService = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getModelServicePricesFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.listForService = [];
      state.pagination = undefined;
    },

    getServicePricesHistory(
      state,
      action: PayloadAction<{
        vehicleServiceId: string;
        vehicleModelId: string;
      }>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getServicePricesHistorySuccess(
      state,
      action: PayloadAction<GetServicePriceListSuccessPayload>
    ) {
      state.loadingList = false;
      state.listHistory = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getServicePricesHistoryFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.listHistory = [];
      state.pagination = undefined;
    },

    resetServicePricesHistory(state) {
      state.loadingList = false;
      state.listHistory = [];
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
      state.listForService = [];
      state.detail = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const servicePriceActions = servicePriceSlice.actions;
export default servicePriceSlice.reducer;
