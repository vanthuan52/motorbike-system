import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../types";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  productDetail: Product | null;
  isDetailLoading: boolean;
  detailError: string | null;
}

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  productDetail: null,
  isDetailLoading: false,
  detailError: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
      state.error = null;
    },
    fetchProductsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchProductDetailRequest(state, action) {
      state.isDetailLoading = true;
      state.detailError = null;
      state.productDetail = null;
    },
    fetchProductDetailSuccess(state, action) {
      state.isDetailLoading = false;
      state.productDetail = action.payload;
      state.detailError = null;
    },
    fetchProductDetailFailure(state, action) {
      state.isDetailLoading = false;
      state.detailError = action.payload;
      state.productDetail = null;
    },
    updateProductRequest(state) {
      state.error = null;
    },
    updateProductSuccess(state) {
      state.error = null;
    },
    updateProductFailure(state, action) {
      state.error = action.payload;
    },
    createProductRequest(state) {
      state.error = null;
    },
    createProductSuccess(state) {
      state.error = null;
    },
    createProductFailure(state, action) {
      state.error = action.payload;
    },
    deleteProductRequest(state, action) {
      state.error = null;
    },
    deleteProductSuccess(state) {
      state.error = null;
    },
    deleteProductFailure(state, action) {
      state.error = action.payload;
    },
  },
});

export const productsActions = productsSlice.actions;
export default productsSlice.reducer;
