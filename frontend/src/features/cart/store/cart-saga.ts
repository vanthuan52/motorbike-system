import { takeLatest, put, select } from "redux-saga/effects";
import { type PayloadAction } from "@reduxjs/toolkit";

import { cartActions } from "./cart-slice";
import { notificationActions } from "@/features/notification/store/notification-slice";
import { AddToCartPayload, RemoveCartItemPayload } from "../types";
import { RootState } from "@/store";

/**
 * Cart Saga
 *
 * Handles side-effects for cart operations (e.g. toast notifications).
 * The cart is persisted via redux-persist, so no API calls are needed for now.
 * When a cart API is introduced, add service calls here.
 */

function* handleAddToCart(action: PayloadAction<AddToCartPayload>) {
  yield put(
    notificationActions.notify({
      type: "success",
      message: "Đã thêm sản phẩm vào giỏ hàng!",
    })
  );
}

function* handleRemoveFromCart(action: PayloadAction<RemoveCartItemPayload>) {
  yield put(
    notificationActions.notify({
      type: "info",
      message: "Đã xóa sản phẩm khỏi giỏ hàng.",
    })
  );
}

function* handleClearCart() {
  yield put(
    notificationActions.notify({
      type: "info",
      message: "Đã xóa toàn bộ giỏ hàng.",
    })
  );
}

export function* cartSaga() {
  yield takeLatest(cartActions.addToCart.type, handleAddToCart);
  yield takeLatest(cartActions.removeFromCart.type, handleRemoveFromCart);
  yield takeLatest(cartActions.clearCart.type, handleClearCart);
}
