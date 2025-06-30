import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  ENUM_SERVICE_CATEGORY_STATUS,
  ServiceCategory,
  ServiceCategoryPaginationQuery,
} from "../types";

interface ServiceCategoryState extends BaseApiState {
  list: ServiceCategory[];
  detail: ServiceCategory | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetServiceCategorySuccessPayload {
  list: ServiceCategory[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: ServiceCategoryState = {
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

export const serviceCategorySlice = createSlice({
  name: "serviceCategory",
  initialState,
  reducers: {
    getServiceCategories(
      state,
      action: PayloadAction<ServiceCategoryPaginationQuery>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getServiceCategoriesSuccess(
      state,
      action: PayloadAction<GetServiceCategorySuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getServiceCategoriesFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getServiceCategoryDetail(
      state,
      action: PayloadAction<{ serviceCategoryId: ServiceCategory["_id"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getServiceCategoryDetailSuccess(
      state,
      action: PayloadAction<ServiceCategory>
    ) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getServiceCategoryDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    createServiceCategory(
      state,
      action: PayloadAction<{ serviceCategory: ServiceCategory }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createServiceCategorySuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createServiceCategoryFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateServiceCategory(
      state,
      action: PayloadAction<{
        serviceCategoryId: string;
        serviceCategory: ServiceCategory;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateServiceCategorySuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateServiceCategoryFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteServiceCategory(
      state,
      action: PayloadAction<{ serviceCategoryId: string }>
    ) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteServiceCategorySuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteServiceCategoryFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    updateServiceCategoryStatus(
      state,
      action: PayloadAction<{
        serviceCategoryId: string;
        status: ENUM_SERVICE_CATEGORY_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateServiceCategoryStatusSuccess(state) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;
    },
    updateServiceCategoryStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    resetServiceCategoryDetail(state) {
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

export const serviceCategoryActions = serviceCategorySlice.actions;
export default serviceCategorySlice.reducer;
