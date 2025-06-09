import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import productsService from "../services/products-api";
import { ApiResponse, Product } from "../types";
import { productsActions } from "./products-slice";
import { toast } from "react-toastify";

function* fetchProductsHandler() {
  try {
    const { data }: ApiResponse<{ products: Product[] }> = yield call(
      productsService.getProducts
    );
    yield put(productsActions.fetchProductsSuccess(data.products));
  } catch (error: any) {
    yield put(productsActions.fetchProductsFailure(error.message));
  }
}

function* fetchProductDetailHandler(action: PayloadAction<string>) {
  try {
    const slug = action.payload;
    const { data }: ApiResponse<{ product: Product | null }> = yield call(
      productsService.getProductDetails,
      slug
    );
    yield put(productsActions.fetchProductDetailSuccess(data.product));
  } catch (error: any) {
    yield put(productsActions.fetchProductDetailFailure(error.message));
  }
}
function* updateProductHandler(action: any) {
  try {
    const { product } = action.payload;
    const { data }: ApiResponse<{ product: Product }> = yield call(
      (product: Product) => productsService.updateProduct(product),
      product
    );
    toast.success("Cập nhật sản phẩm thành công");
    yield put(productsActions.updateProductSuccess());
  } catch (error: any) {
    yield put(productsActions.updateProductFailure(error.message));
  }
}
function* createProductHandler(action: any) {
  try {
    const { product } = action.payload;
    const { data }: ApiResponse<{ product: Product }> = yield call(
      (product: Product) => productsService.createProduct(product),
      product
    );
    toast.success("Thêm sản phẩm thành công");
    yield put(productsActions.createProductSuccess());
  } catch (error: any) {
    yield put(productsActions.createProductFailure(error.message));
  }
}
function* deleteProductHandler(action: PayloadAction<string>) {
  try {
    const { slug } = action.payload;
    const { data }: ApiResponse<{ product: Product }> = yield call(
      (slug: string) => productsService.deleteProduct(slug),
      slug
    );
    toast.success("Xóa sản phẩm thành công");
    yield put(productsActions.deleteProductSuccess());
  } catch (error: any) {
    yield put(productsActions.deleteProductFailure(error.message));
  }
}
export function* productsRootSaga() {
  yield takeLatest(productsActions.fetchProductsRequest, fetchProductsHandler);
  yield takeLatest(
    productsActions.fetchProductDetailRequest,
    fetchProductDetailHandler
  );
  yield takeLatest(productsActions.updateProductRequest, updateProductHandler);
  yield takeLatest(
    productsActions.createProductRequest.type,
    createProductHandler
  );
  yield takeLatest(productsActions.deleteProductRequest, deleteProductHandler);
}
