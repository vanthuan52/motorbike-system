import { all } from "redux-saga/effects";
import { authSaga } from "@/modules/auth/store/auth-saga";
import { productsRootSaga } from "@/modules/products/store/products-saga";

export default function* rootSaga() {
  yield all([authSaga(), productsRootSaga()]);
}
