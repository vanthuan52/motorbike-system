import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import partTypeServices from "../part-type.service";
import { partTypeActions } from "./part-type-slice";
import {
  PartType,
  PartTypeDetailResponse,
  PartTypeListResponse,
  PartTypePaginationQuery,
} from "../types";

function* getPartTypesHandler(action: PayloadAction<PartTypePaginationQuery>) {
  try {
    const response: PartTypeListResponse = yield call(
      partTypeServices.getPartTypes,
      action.payload
    );
    const partTypes = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      partTypeActions.getPartTypesSuccess({
        partTypes: partTypes ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(partTypeActions.getPartTypesFailure(message));
  }
}

function* getPartTypeDetailHandler(
  action: PayloadAction<{ slug: PartType["slug"] }>
) {
  try {
    const { slug } = action.payload;
    const response: PartTypeDetailResponse = yield call(
      partTypeServices.getPartTypeDetail,
      slug
    );
    const partType = response.data;

    yield put(partTypeActions.getPartTypeDetailSuccess(partType!));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(partTypeActions.getPartTypeDetailFailure(message));
  }
}

export function* partTypeRootSaga() {
  yield takeLatest(partTypeActions.getPartTypes, getPartTypesHandler);
  yield takeLatest(partTypeActions.getPartTypeDetail, getPartTypeDetailHandler);
}
