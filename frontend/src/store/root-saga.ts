import { all } from "redux-saga/effects";
import { authSaga } from "../features/auth/store/auth-saga";
import { categoriesRootSaga } from "../features/category/store/category-saga";
import { hiringRootSaga } from "@/features/hiring/store/hiring-saga";

export default function* rootSaga() {
  yield all([authSaga(), categoriesRootSaga(), hiringRootSaga()]);
}
