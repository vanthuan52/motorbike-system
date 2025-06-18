import { all } from "redux-saga/effects";
import { authSaga } from "@/modules/auth/store/auth-saga";
import { productsRootSaga } from "@/modules/products/store/products-saga";
import { categoriesRootSaga } from "@/modules/category/store/categories-saga";
import { notificationSaga } from "@/modules/notification/store/notification-saga";
import { hiringRootSaga } from "@/modules/hiring/store/hiring-saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    notificationSaga(),
    productsRootSaga(),
    categoriesRootSaga(),
    hiringRootSaga(),
  ]);
}
