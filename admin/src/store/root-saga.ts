import { all } from "redux-saga/effects";
import { authSaga } from "@/modules/auth/store/auth-saga";
import { productsRootSaga } from "@/modules/products/store/products-saga";
import { categoriesRootSaga } from "@/modules/category/store/categories-saga";

export default function* rootSaga() {
  yield all([authSaga(), productsRootSaga(), categoriesRootSaga()]);
}
