import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../types";

type AsyncState<T = unknown> = {
  loading: boolean;
  success: boolean;
  error: string | null;
  data?: T;
};

interface CategoriesState {
  list: {
    data: Category[];
    total: number;
    totalPage: number;
    loading: boolean;
    error: string | null;
  };
  detail: AsyncState<Category | null>;
}

const initialAsyncState = {
  loading: false,
  success: false,
  error: null,
};

const initialState: CategoriesState = {
  list: {
    data: [],
    total: 0,
    totalPage: 0,
    loading: false,
    error: null,
  },
  detail: {
    ...initialAsyncState,
    data: null,
  },
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategoriesRequest(state, action) {
      state.list.loading = true;
      state.list.error = null;
    },
    fetchCategoriesSuccess(state, action) {
      state.list.loading = false;
      state.list.data = action.payload.data;
      state.list.total = action.payload._metadata.pagination.total;
      state.list.totalPage = action.payload._metadata.pagination.totalPage;
    },
    fetchCategoriesFailure(state, action) {
      state.list.loading = false;
      state.list.error = action.payload;
    },

    fetchCategoryDetailRequest(state, action) {
      state.detail.loading = true;
      state.detail.error = null;
      state.detail.data = null;
    },
    fetchCategoryDetailSuccess(state, action) {
      state.detail.loading = false;
      state.detail.success = true;
      state.detail.data = action.payload;
    },
    fetchCategoryDetailFailure(state, action) {
      state.detail.loading = false;
      state.detail.error = action.payload;
    },
    reset(state) {
      state.list = initialState.list;
      state.detail = initialState.detail;
    },
  },
});

export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;
