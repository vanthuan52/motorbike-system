import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import { categoriesActions } from "./categories-slice";
import { Category, ENUM_PART_TYPE_STATUS } from "../types";
import categoriesService from "../services/categories-api";

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
    const id = action.payload;
    const data = yield call(categoriesService.getCategoryDetails, id);
    yield put(categoriesActions.fetchCategoryDetailSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.fetchCategoriesFailure(message));
  }
}

function* createCategoryHandler(action: PayloadAction<{ category: Category }>) {
  try {
    const { category } = action.payload;
    yield call(categoriesService.createCategory, category);
    toast.success("Tạo danh mục thành công");
    yield put(categoriesActions.createCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.createCategoryFailure(message));
  }
}

function* updateCategoryHandler(
  action: PayloadAction<{ category: Category; id: string }>
) {
  try {
    const { category, id } = action.payload;
    yield call(categoriesService.updateCategory, id, category);
    toast.success("Cập nhật danh mục thành công");
    yield put(categoriesActions.updateCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.updateCategoryFailure(message));
  }
}

function* deleteCategoryHandler(action: PayloadAction<{ id: string }>) {
  try {
    const { id } = action.payload;
    yield call(categoriesService.deleteCategory, id);
    toast.success("Xoá danh mục thành công");
    yield put(categoriesActions.deleteCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.deleteCategoryFailure(message));
  }
}

function* updateCategoryStatusHandler(
  action: PayloadAction<{ id: string; status: ENUM_PART_TYPE_STATUS }>
) {
  try {
    const { id, status } = action.payload;
    yield call(categoriesService.updateCategoryStatus, id, status);
    toast.success("Cập nhật trang thái danh mục thành công");
    yield put(categoriesActions.updateStatusCategorySuccess({ id, status }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.updateStatusCategoryFailure(message));
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
  yield takeLatest(
    categoriesActions.deleteCategoryRequest,
    deleteCategoryHandler
  );
  yield takeLatest(
    categoriesActions.updateCategoryRequest,
    updateCategoryHandler
  );
  yield takeLatest(
    categoriesActions.createCategoryRequest,
    createCategoryHandler
  );
  yield takeLatest(
    categoriesActions.updateStatusCategoryRequest,
    updateCategoryStatusHandler
  );
}
