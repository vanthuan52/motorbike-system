import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";

import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import {
  ENUM_PART_TYPE_STATUS,
  PartType,
  PartTypePaginationQuery,
} from "../types";

interface partTypeState extends BaseApiState {
  partTypes: PartType[];
  partType: PartType | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetPartTypeSuccessPayload {
  partTypes: PartType[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: partTypeState = {
  partTypes: [],
  partType: null,
  loadingList: false,
  loadingSingle: false,
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
  partialUpdate: {
    loading: false,
    success: false,
  },
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
};

export const partTypeSlice = createSlice({
  name: "partType",
  initialState,
  reducers: {
    getPartType(state, action: PayloadAction<PartTypePaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getPartTypeSuccess(
      state,
      action: PayloadAction<GetPartTypeSuccessPayload>
    ) {
      state.loadingList = false;
      state.partTypes = action.payload.partTypes;
      state.pagination = action.payload.pagination;
    },
    getPartTypeFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.partTypes = [];
      state.pagination = undefined;
    },

    getPartTypeDetail(state, action: PayloadAction<{ partTypeId: string }>) {
      state.loadingSingle = true;
      state.error = null;
    },
    getPartTypeDetailSuccess(state, action: PayloadAction<PartType>) {
      state.loadingSingle = false;
      state.partType = action.payload;
    },
    getPartTypeDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.partType = null;
    },

    createPartType(state, action: PayloadAction<{ partType: PartType }>) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createPartTypeSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createPartTypeFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updatePartType(
      state,
      action: PayloadAction<{ partTypeId: string; partType: PartType }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updatePartTypeSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updatePartTypeFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deletePartType(state, action: PayloadAction<{ partTypeId: string }>) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deletePartTypeSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deletePartTypeFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },

    updatePartTypeStatus(
      state,
      action: PayloadAction<{
        partTypeId: string;
        status: ENUM_PART_TYPE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    updatePartTypeStatusSuccess(
      state,
      action: PayloadAction<{
        partTypeId: string;
        status: ENUM_PART_TYPE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;

      const { partTypeId, status } = action.payload;
      const index = state.partTypes.findIndex(
        (partType) => partType._id === partTypeId
      );
      if (index !== -1) {
        state.partTypes[index].status = status;
      }
    },
    updatePartTypeStatusFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    resetPartTypeDetail(state) {
      state.loadingSingle = false;
      state.partType = null;
      state.error = null;
    },

    resetState(state) {
      state.create = { loading: false, success: false };
      state.update = { loading: false, success: false };
      state.deletion = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
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
