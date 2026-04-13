import { call, put, takeLatest } from "redux-saga/effects";

import bannerServices from "../banner.service";
import { bannerActions } from "./banner-slice";
import { BannerListResponse } from "../types";

function* getBannersHandler() {
  try {
    const response: BannerListResponse = yield call(
      bannerServices.getBanners
    );
    const banners = response.data;

    yield put(bannerActions.getBannersSuccess(banners ?? []));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(bannerActions.getBannersFailure(message));
  }
}

export function* bannerRootSaga() {
  yield takeLatest(bannerActions.getBanners, getBannersHandler);
}
