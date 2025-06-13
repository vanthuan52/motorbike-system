import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../types";

interface CategoriesState {
  categories: Category[];
  total: number;
  isLoading: boolean;
  error: string | null;
  categoryDetail: Category | null;
  isDetailLoading: boolean;
  detailError: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  total: 0,
  isLoading: false,
  error: null,
  categoryDetail: null,
  isDetailLoading: false,
  detailError: null,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategoriesRequest(state, action) {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload.categories;
      state.total = action.payload.total;
      state.error = null;
    },
    fetchCategoriesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchCategoryDetailRequest(state, action) {
      state.isDetailLoading = true;
      state.detailError = null;
      state.categoryDetail = null;
    },
    fetchCategoryDetailSuccess(state, action) {
      state.isDetailLoading = false;
      state.categoryDetail = action.payload;
      state.detailError = null;
    },
    fetchCategoryDetailFailure(state, action) {
      state.isDetailLoading = false;
      state.detailError = action.payload;
      state.categoryDetail = null;
    },
    createCategoryRequest(state, action) {
      state.error = null;
    },
    createCategorySuccess(state) {
      state.error = null;
    },
    createCategoryFailure(state, action) {
      state.error = action.payload;
    },
    updateCategoryRequest(state, action) {
      state.error = null;
      const { slug, category } = action.payload;
      const idx = state.categories.findIndex(cat => cat.slug === slug);
      if (idx !== -1) {
        state.categories[idx] = category;
      }
    },
    updateCategorySuccess(state) {
      state.error = null;
    },
    updateCategoryFailure(state, action) {
      state.error = action.payload;
    },
    deleteCategoryRequest(state, action) {
      state.error = null;
      const slug = action.payload;
      state.categories = state.categories.filter(cat => cat.slug !== slug);
    },
    deleteCategorySuccess(state) {
      state.error = null;
    },
    deleteCategoryFailure(state, action) {
      state.error = action.payload;
    },
    updateStatusCategoryRequest(state, action) {
      state.error = null;
      const { slug, status } = action.payload;
      const idx = state.categories.findIndex(cat => cat.slug === slug);
      if (idx !== -1) {
        state.categories[idx].status = status;
      }
    },
    updateStatusCategorySuccess(state, action) {
      state.error = null;
      const { slug, status } = action.payload;
      const idx = state.categories.findIndex(cat => cat.slug === slug);
      if (idx !== -1) {
        state.categories[idx].status = status;
      }
    },
    updateStatusCategoryFailure(state, action) {
      state.error = action.payload;
    },
  },
});
export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;
