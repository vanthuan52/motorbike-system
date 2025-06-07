import { call, put, takeLatest } from "redux-saga/effects";
import productsService from "../services/products-api";
import { ApiResponse, Product } from "../types";
import { productsActions } from "./products-slice";

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

function* fetchProductDetailHandler(action: any) {
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

export function* productsRootSaga() {
  yield takeLatest(productsActions.fetchProductsRequest, fetchProductsHandler);
  yield takeLatest(
    productsActions.fetchProductDetailRequest,
    fetchProductDetailHandler
  );
}
