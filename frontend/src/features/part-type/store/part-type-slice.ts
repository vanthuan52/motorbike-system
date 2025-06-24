import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PartType, PartTypePaginationQuery } from "../types";
import { BaseApiState } from "@/types/redux-common.type";
import { ApiResponsePagination } from "@/types/api.type";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

interface PartTypeState extends Partial<BaseApiState> {
  partTypes: PartType[];
  partType: PartType | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetPartTypesSuccessPayload {
  partTypes: PartType[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: PartTypeState = {
  partTypes: [],
  partType: null,
  loadingList: false,
  loadingSingle: false,
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
};

export const partTypeSlice = createSlice({
  name: "partTypes",
  initialState,
  reducers: {
    getPartTypes(state, action: PayloadAction<PartTypePaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getPartTypesSuccess(
      state,
      action: PayloadAction<GetPartTypesSuccessPayload>
    ) {
      state.loadingList = false;
      state.error = null;
      state.partTypes = action.payload.partTypes;
      state.pagination = action.payload.pagination;
    },
    getPartTypesFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.partTypes = [];
      state.pagination = undefined;
    },

    getPartTypeDetail(
      state,
      action: PayloadAction<{ slug: PartType["slug"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getPartTypeDetailSuccess(state, action: PayloadAction<PartType>) {
      state.loadingSingle = false;
      state.error = null;
      state.partType = action.payload;
    },
    getPartTypeDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.partType = null;
    },
    reset(state) {
      state.loadingList = false;
      state.loadingSingle = false;
      state.partTypes = [];
      state.partType = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const partTypeActions = partTypeSlice.actions;
export default partTypeSlice.reducer;
