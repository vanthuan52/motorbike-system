import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import candidateService from "../candidate.service";
import { candidateActions } from "./candidate-slice";
import {
  Candidate,
  CandidatePaginationQuery,
  CandidateDetailResponse,
  CandidateListResponse,
  CandidateUpdateStatusResponse,
  ENUM_CANDIDATE_STATUS,
  CandidateReviewPaginationQuery,
  CandidateReview,
  CandidateReviewListResponse,
} from "../types";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { RootState } from "@/store";

function* getCandidatesHandler(
  action: PayloadAction<CandidatePaginationQuery>
) {
  try {
    const response: CandidateListResponse = yield call(
      candidateService.getCandidates,
      action.payload
    );
    const candidates = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      candidateActions.getCandidatesSuccess({
        candidates: candidates ?? [],
        pagination: paginationMetadata,
      })
    );
  } catch (error: any) {
    const errorMessage = error.message || "Lấy danh sách ứng viên thất bại!";
    yield put(candidateActions.getCandidatesFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

function* getCandidateDetailHandler(
  action: PayloadAction<{ candidateId: Candidate["_id"] }>
) {
  try {
    const { candidateId } = action.payload;
    const response: CandidateDetailResponse = yield call(
      candidateService.getCandidateDetail,
      candidateId
    );
    const candidate = response.data;
    yield put(candidateActions.getCandidateDetailSuccess(candidate!));
  } catch (error: any) {
    const errorMessage = error.message || "Lấy chi tiết ứng viên thất bại!";
    yield put(candidateActions.getCandidateDetailFailure(errorMessage));
  }
}

function* updateCandidateStatusHandler(
  action: PayloadAction<{ candidateId: string; status: ENUM_CANDIDATE_STATUS }>
) {
  try {
    const { candidateId, status } = action.payload;
    const response: CandidateUpdateStatusResponse = yield call(
      candidateService.updateCandidateStatus,
      candidateId,
      status
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message || "Cập nhật trạng thái thành công",
      })
    );
    yield put(candidateActions.updateCandidateStatusSuccess());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    yield put(
      notificationActions.notify({
        type: "error",
        message,
      })
    );
    yield put(candidateActions.updateCandidateStatusFailure(message));
  }
}

function* getCandidateReviewHandler(
  action: PayloadAction<CandidateReviewPaginationQuery>
) {
  try {
    const response: CandidateReviewListResponse = yield call(
      candidateService.getCandidateReview,
      action.payload
    );
    const candidateReviews = response.data;
    const paginationMetadata = response?._metadata?.pagination;

    yield put(
      candidateActions.getCandidateReviewsSuccess({
        candidateReviews: candidateReviews ?? [],
        paginationCandidateReviews: paginationMetadata,
      })
    );
  } catch (error: any) {
    const errorMessage = error.message || "Lấy danh sách ứng viên thất bại!";
    yield put(candidateActions.getCandidateReviewsFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

function* createCandidateReviewHandler(
  action: PayloadAction<{ candidateReview: CandidateReview }>
) {
  try {
    const { candidateReview } = action.payload;

    const response: CandidateListResponse = yield call(
      candidateService.createCandidateReview,
      candidateReview
    );

    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );

    yield put(candidateActions.createCandidateReviewSuccess());

    const { candidate, paginationCandidateReviews } = yield select(
      (state: RootState) => state.candidates
    );

    const newQuery: CandidateReviewPaginationQuery = {
      candidate: candidate?._id,
      page: paginationCandidateReviews?.page,
      perPage: paginationCandidateReviews?.perPage,
    };

    yield put(candidateActions.getCandidateReviews(newQuery));
  } catch (error: any) {
    const errorMessage = error.message || "Lấy danh sách ứng viên thất bại!";
    yield put(candidateActions.createCandidateReviewFailure(errorMessage));
    yield put(
      notificationActions.notify({ type: "error", message: errorMessage })
    );
  }
}

export function* candidateSaga() {
  yield takeLatest(candidateActions.getCandidates, getCandidatesHandler);
  yield takeLatest(
    candidateActions.getCandidateDetail.type,
    getCandidateDetailHandler
  );
  yield takeLatest(
    candidateActions.updateCandidateStatus.type,
    updateCandidateStatusHandler
  );
  yield takeLatest(
    candidateActions.getCandidateReviews,
    getCandidateReviewHandler
  );
  yield takeLatest(
    candidateActions.createCandidateReview,
    createCandidateReviewHandler
  );
}
