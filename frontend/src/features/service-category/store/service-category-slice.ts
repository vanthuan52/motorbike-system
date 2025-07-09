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
      action: PayloadAction<{ serviceCategorySlug: ServiceCategory["slug"] }>
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
