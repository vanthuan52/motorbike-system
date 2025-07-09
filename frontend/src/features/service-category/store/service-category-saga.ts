import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, take, takeLatest } from "redux-saga/effects";
import { serviceCategoryActions } from "./service-category-slice";
import {
  ENUM_SERVICE_CATEGORY_STATUS,
  ServiceCategory,
  ServiceCategoryDetailResponse,
  ServiceCategoryListResponse,
  ServiceCategoryPaginationQuery,
} from "../types";
import serviceCategoryService from "../services/service-category.service";
import { notificationActions } from "@/features/notification/store/notification-slice";

function* getServiceCategoryListHandler(
  action: PayloadAction<ServiceCategoryPaginationQuery>
) {
  try {
    const response: ServiceCategoryListResponse = yield call(
      serviceCategoryService.getServiceCategoryList,
      action.payload
    );

    const serviceCategories = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      serviceCategoryActions.getServiceCategoriesSuccess({
        list: serviceCategories ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const message = error.message || "Lấy danh sách danh mục thất bại!";
    yield put(serviceCategoryActions.getServiceCategoriesFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* getServiceCategoryDetailHandler(
  action: PayloadAction<{ serviceCategorySlug: ServiceCategory["slug"] }>
) {
  try {
    const { serviceCategorySlug } = action.payload;
    const response: ServiceCategoryDetailResponse = yield call(
      serviceCategoryService.getServiceCategoryDetails,
      serviceCategorySlug
    );
    const detail = response.data;
    yield put(serviceCategoryActions.getServiceCategoryDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết danh mục thất bại!";
    yield put(serviceCategoryActions.getServiceCategoryDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

export function* serviceCategorySaga() {
  yield takeLatest(
    serviceCategoryActions.getServiceCategories,
    getServiceCategoryListHandler
  );
  yield takeLatest(
    serviceCategoryActions.getServiceCategoryDetail,
    getServiceCategoryDetailHandler
  );
}
