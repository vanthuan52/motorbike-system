import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { categoriesActions } from "./categories-slice";
import { ApiResponse, Category } from "../types";
import categoriesService from "../services/categories-api";
import { toast } from "react-toastify";

function* fetchCategoriesHandler(action: PayloadAction<object>) {
  try {
    const payload = action.payload;
    const { data }: ApiResponse<{ categories: Category[]; total: number }> =
      yield call(categoriesService.mockGetCategories, payload);
    yield put(categoriesActions.fetchCategoriesSuccess(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.fetchCategoriesFailure(message));
  }
}

function* fetchCategoryDetailHandler(action: PayloadAction<string>) {
  try {
    const slug = action.payload;
    const { data }: ApiResponse<{ category: Category | null }> = yield call(
      categoriesService.mockGetCategoryDetails,
      slug
    );
    yield put(categoriesActions.fetchCategoryDetailSuccess(data.category));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.fetchCategoriesFailure(message));
  }
}
function* createCategoryHandler(action: PayloadAction<{ category: Category }>) {
  try {
    const { category } = action.payload;
    yield call(
      (category: Category) => categoriesService.mockCreateCategory(category),
      category
    );
    toast.success("Tạo danh mục thành công");
    yield put(categoriesActions.createCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.createCategoryFailure(message));
  }
}

function* updateCategoryHandler(
  action: PayloadAction<{ category: Category; slug: string }>
) {
  try {
    const { category, slug } = action.payload;
    yield call(categoriesService.mockUpdateCategory, slug, category);
    toast.success("Cập nhật danh mục thành công");
    yield put(categoriesActions.updateCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.updateCategoryFailure(message));
  }
}
function* deleteCategoryHandler(action: PayloadAction<{ slug: string }>) {
  try {
    const { slug } = action.payload;
    yield call(
      (slug: string) => categoriesService.mockDeleteCategory(slug),
      slug
    );
    toast.success("Xoá danh mục thành công");
    yield put(categoriesActions.deleteCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(categoriesActions.deleteCategoryFailure(message));
  }
}
function* updateCategoryStatusHandler(
  action: PayloadAction<{ slug: string; status: boolean }>
) {
  try {
    const { slug, status } = action.payload;
    yield call(categoriesService.mockUpdateCategoryStatus, slug, status);
    toast.success("Cập nhật trang thái danh mục thành công");
    yield put(categoriesActions.updateStatusCategorySuccess({ slug, status }));
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
