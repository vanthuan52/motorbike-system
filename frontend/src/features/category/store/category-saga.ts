import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import categoriesService from "../categories.service";
import { categoriesActions } from "./category-slice";

function* fetchCategoriesHandler(
  action: PayloadAction<object>
): Generator<any, void, any> {
  try {
    const payload = action.payload;
    const data = yield call(categoriesService.getCategoryList, payload);
    yield put(categoriesActions.fetchCategoriesSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.fetchCategoriesFailure(message));
  }
}

function* fetchCategoryDetailHandler(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    const slug = action.payload;
    const data = yield call(categoriesService.getCategoryDetails, slug);
    yield put(categoriesActions.fetchCategoryDetailSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.fetchCategoriesFailure(message));
  }
}

export function* categoriesRootSaga() {
  yield takeLatest(
    categoriesActions.fetchCategoriesRequest,
    fetchCategoriesHandler
  );
  yield takeLatest(
    categoriesActions.fetchCategoryDetailRequest,
    fetchCategoryDetailHandler
  );
}
