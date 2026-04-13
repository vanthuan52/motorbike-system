import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import hiringService from "../hiring.service";
import { hiringActions } from "./hiring-slice";
import { notificationActions } from "@/features/notification/store/notification-slice";
import { Hiring, HiringDetailResponse, HiringPaginationQuery } from "../types";
import { SagaIterator } from "redux-saga";

function* getHiringHandler(
  action: PayloadAction<HiringPaginationQuery>
): SagaIterator {
  try {
    const response = yield call(hiringService.getHiringList, action.payload);
    const hiringList = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      hiringActions.getHiringListSuccess({
        hiringList: hiringList ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(hiringActions.getHiringListFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

function* getHiringDetailHandler(
  action: PayloadAction<{ hiringId: Hiring["_id"] }>
) {
  try {
    const { hiringId } = action.payload;
    const response: HiringDetailResponse = yield call(
      hiringService.getHiringDetails,
      hiringId
    );
    const hiringDetail = response.data;
    yield put(
      hiringActions.getHiringDetailSuccess(hiringDetail as unknown as Hiring)
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(hiringActions.getHiringListFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

export function* hiringRootSaga() {
  yield takeLatest(hiringActions.getHiringList.type, getHiringHandler);
  yield takeLatest(hiringActions.getHiringDetail, getHiringDetailHandler);
}
