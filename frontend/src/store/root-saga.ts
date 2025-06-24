import { all } from "redux-saga/effects";
import { authSaga } from "../features/auth/store/auth-saga";
import { partTypeRootSaga } from "../features/part-type/store/part-type-saga";
import { hiringRootSaga } from "@/features/hiring/store/hiring-saga";

export default function* rootSaga() {
  yield all([authSaga(), partTypeRootSaga(), hiringRootSaga()]);
}
