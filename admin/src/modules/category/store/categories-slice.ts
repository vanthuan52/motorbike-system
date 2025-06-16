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
    loading: boolean;
    error: string | null;
  };
  detail: AsyncState<Category | null>;
  create: AsyncState;
  update: AsyncState;
  remove: AsyncState;
  updateStatus: AsyncState;
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
    loading: false,
    error: null,
  },
  detail: {
    ...initialAsyncState,
    data: null,
  },
  create: { ...initialAsyncState },
  update: { ...initialAsyncState },
  remove: { ...initialAsyncState },
  updateStatus: { ...initialAsyncState },
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

    createCategoryRequest(state, action) {
      state.create = { ...initialAsyncState, loading: true };
    },
    createCategorySuccess(state) {
      state.create = { ...initialAsyncState, success: true };
    },
    createCategoryFailure(state, action) {
      state.create = { ...initialAsyncState, error: action.payload };
    },

    updateCategoryRequest(state, action) {
      state.update = { ...initialAsyncState, loading: true };
    },
    updateCategorySuccess(state) {
      state.update = { ...initialAsyncState, success: true };
    },
    updateCategoryFailure(state, action) {
      state.update = { ...initialAsyncState, error: action.payload };
    },

    deleteCategoryRequest(state, action) {
      state.remove = { ...initialAsyncState, loading: true };
    },
    deleteCategorySuccess(state) {
      state.remove = { ...initialAsyncState, success: true };
    },
    deleteCategoryFailure(state, action) {
      state.remove = { ...initialAsyncState, error: action.payload };
    },

    updateStatusCategoryRequest(state, action) {
      state.updateStatus = { ...initialAsyncState, loading: true };
    },
    updateStatusCategorySuccess(state, action) {
      state.updateStatus = { ...initialAsyncState, success: true };
    },
    updateStatusCategoryFailure(state, action) {
      state.updateStatus = { ...initialAsyncState, error: action.payload };
    },
    reset(state) {
      state.list = initialState.list;
      state.detail = initialState.detail;
      state.create = initialState.create;
      state.update = initialState.update;
      state.remove = initialState.remove;
      state.updateStatus = initialState.updateStatus;
    }
  },
});

export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;
