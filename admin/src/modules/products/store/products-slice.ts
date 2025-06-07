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
  },
});

export const productsActions = productsSlice.actions;
export default productsSlice.reducer;
