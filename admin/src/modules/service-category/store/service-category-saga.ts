import { type PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { serviceCategoryActions } from "./service-category-slice";
import {
  ENUM_SERVICE_CATEGORY_STATUS,
  ServiceCategory,
  ServiceCategoryCreationResponse,
  ServiceCategoryDeleteResponse,
  ServiceCategoryDetailResponse,
  ServiceCategoryListResponse,
  ServiceCategoryPaginationQuery,
  ServiceCategoryUpdateResponse,
  ServiceCategoryUpdateStatusResponse,
} from "../types";
import serviceCategoryService from "../services/service-category.service";

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
  action: PayloadAction<{ serviceCategoryId: ServiceCategory["_id"] }>
) {
  try {
    const { serviceCategoryId } = action.payload;
    const response: ServiceCategoryDetailResponse = yield call(
      serviceCategoryService.getServiceCategoryDetails,
      serviceCategoryId
    );
    const detail = response.data;
    yield put(serviceCategoryActions.getServiceCategoryDetailSuccess(detail!));
  } catch (error: any) {
    const message = error.message || "Lấy chi tiết danh mục thất bại!";
    yield put(serviceCategoryActions.getServiceCategoryDetailFailure(message));
    yield put(notificationActions.notify({ type: "error", message }));
  }
}

function* createServiceCategoryHandler(
  action: PayloadAction<{ serviceCategory: ServiceCategory }>
) {
  try {
    const { serviceCategory } = action.payload;
    const response: ServiceCategoryCreationResponse = yield call(
      serviceCategoryService.createServiceCategory,
      serviceCategory
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(serviceCategoryActions.createServiceCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(serviceCategoryActions.createServiceCategoryFailure(message));
  }
}

function* updateServiceCategoryHandler(
  action: PayloadAction<{
    serviceCategoryId: string;
    serviceCategory: ServiceCategory;
  }>
) {
  try {
    const { serviceCategoryId, serviceCategory } = action.payload;
    const response: ServiceCategoryUpdateResponse = yield call(
      serviceCategoryService.updateServiceCategory,
      serviceCategoryId,
      serviceCategory
    );

    yield put(serviceCategoryActions.updateServiceCategorySuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(
      serviceCategoryActions.getServiceCategoryDetail({ serviceCategoryId })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(serviceCategoryActions.updateServiceCategoryFailure(message));
  }
}

function* deleteServiceCategoryHandler(
  action: PayloadAction<{ serviceCategoryId: ServiceCategory["_id"] }>
) {
  try {
    const { serviceCategoryId } = action.payload;
    const response: ServiceCategoryDeleteResponse = yield call(
      serviceCategoryService.deleteServiceCategory,
      serviceCategoryId
    );
    yield put(
      notificationActions.notify({ type: "info", message: response.message })
    );
    yield put(serviceCategoryActions.deleteServiceCategorySuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(notificationActions.notify({ type: "error", message }));
    yield put(serviceCategoryActions.deleteServiceCategoryFailure(message));
  }
}

function* updateServiceCategoryStatusHandler(
  action: PayloadAction<{
    serviceCategoryId: string;
    status: ENUM_SERVICE_CATEGORY_STATUS;
  }>
) {
  try {
    const { serviceCategoryId, status } = action.payload;
    const response: ServiceCategoryUpdateStatusResponse = yield call(
      serviceCategoryService.updateServiceCategoryStatus,
      serviceCategoryId,
      status
    );

    yield put(serviceCategoryActions.updateServiceCategoryStatusSuccess());
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(
      serviceCategoryActions.updateServiceCategoryStatusFailure(message)
    );
  }
}
export function* ServiceCategorySaga() {
  yield takeLatest(
    serviceCategoryActions.getServiceCategories,
    getServiceCategoryListHandler
  );
  yield takeLatest(
    serviceCategoryActions.getServiceCategoryDetail,
    getServiceCategoryDetailHandler
  );
  yield takeLatest(
    serviceCategoryActions.createServiceCategory,
    createServiceCategoryHandler
  );
  yield takeLatest(
    serviceCategoryActions.updateServiceCategory,
    updateServiceCategoryHandler
  );
  yield takeLatest(
    serviceCategoryActions.deleteServiceCategory,
    deleteServiceCategoryHandler
  );
  yield takeLatest(
    serviceCategoryActions.updateServiceCategoryStatus,
    updateServiceCategoryStatusHandler
  );
}
