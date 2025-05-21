import { all } from "redux-saga/effects";
import { authSaga } from "@/modules/auth/store/auth-saga";

export default function* rootSaga() {
  yield all([authSaga()]);
}
