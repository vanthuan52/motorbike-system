import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  Candidate,
  CandidatePaginationQuery,
  CandidateReview,
  CandidateReviewPaginationQuery,
  ENUM_CANDIDATE_STATUS,
} from "../types";

interface CandidateState extends BaseApiState {
  candidates: Candidate[];
  candidate: Candidate | null;
  candidateReviews: CandidateReview[];
  loadingCandidateReviews: boolean;
  createCandidateReview: {
    loading: boolean;
    success: boolean;
  };
  error: string | null;
  pagination: ApiResponsePagination | undefined;
  paginationCandidateReviews: ApiResponsePagination | undefined;
}

interface GetCandidatesSuccessPayload {
  candidates: Candidate[];
  pagination: ApiResponsePagination | undefined;
}

interface GetCandidateReviewsSuccessPayload {
  candidateReviews: CandidateReview[];
  paginationCandidateReviews: ApiResponsePagination | undefined;
}

const initialState: CandidateState = {
  candidates: [],
  candidate: null,
  candidateReviews: [],
  loadingList: false,
  loadingSingle: false,
  loadingCandidateReviews: false,
  partialUpdate: {
    loading: false,
    success: false,
  },
  create: {
    loading: false,
    success: false,
  },
  update: {
    loading: false,
    success: false,
  },
  deletion: {
    loading: false,
    success: false,
  },
  createCandidateReview: {
    loading: false,
    success: false,
  },
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
  paginationCandidateReviews: PAGINATION_QUERY_INITIAL_STATE,
};

export const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    getCandidates(state, action: PayloadAction<CandidatePaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getCandidatesSuccess(
      state,
      action: PayloadAction<GetCandidatesSuccessPayload>
    ) {
      state.loadingList = false;
      state.error = null;
      state.candidates = action.payload.candidates;
      state.pagination = action.payload.pagination;
    },
    getCandidatesFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.candidates = [];
      state.pagination = undefined;
    },

    getCandidateDetail(
      state,
      action: PayloadAction<{ candidateId: Candidate["_id"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getCandidateDetailSuccess(state, action: PayloadAction<Candidate>) {
      state.loadingSingle = false;
      state.error = null;
      state.candidate = action.payload;
    },
    getCandidateDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.candidate = null;
    },

    updateCandidateStatus(
      state,
      action: PayloadAction<{
        candidateId: string;
        status: ENUM_CANDIDATE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updateCandidateStatusSuccess(state) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;
    },
    updateCandidateStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    getCandidateReviews(
      state,
      action: PayloadAction<CandidateReviewPaginationQuery>
    ) {
      state.loadingCandidateReviews = true;
      state.error = null;
      state.pagination = undefined;
    },
    getCandidateReviewsSuccess(
      state,
      action: PayloadAction<GetCandidateReviewsSuccessPayload>
    ) {
      state.loadingCandidateReviews = false;
      state.error = null;
      state.candidateReviews = action.payload.candidateReviews;
      state.pagination = action.payload.paginationCandidateReviews;
    },
    getCandidateReviewsFailure(state, action: PayloadAction<string>) {
      state.loadingCandidateReviews = false;
      state.error = action.payload;
      state.candidateReviews = [];
      state.pagination = undefined;
    },
    createCandidateReview(
      state,
      action: PayloadAction<{ candidateReview: CandidateReview }>
    ) {
      state.createCandidateReview.loading = true;
      state.createCandidateReview.success = false;
      state.error = null;
    },
    createCandidateReviewSuccess(state) {
      state.createCandidateReview.loading = false;
      state.createCandidateReview.success = true;
      state.error = null;
    },
    createCandidateReviewFailure(state, action: PayloadAction<string>) {
      state.createCandidateReview.loading = false;
      state.createCandidateReview.success = false;
      state.error = action.payload;
    },
    resetCandidateDetail(state) {
      state.loadingSingle = false;
      state.candidate = null;
      state.error = null;
    },
    resetCreateCandidateReview(state) {
      state.createCandidateReview = { loading: false, success: false };
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const candidateActions = candidateSlice.actions;
export default candidateSlice.reducer;
