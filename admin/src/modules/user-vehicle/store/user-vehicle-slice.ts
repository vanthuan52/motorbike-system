import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { ApiResponsePagination } from "@/types/api.type";
import { BaseApiState } from "@/types/redux-common.type";
import { UserVehicle, UserVehiclePaginationQuery } from "../types";

interface UserVehicleState extends BaseApiState {
  list: UserVehicle[];
  detail: UserVehicle | null;
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

interface GetUserVehicleSuccessPayload {
  list: UserVehicle[];
  pagination: ApiResponsePagination | undefined;
}

const initialState: UserVehicleState = {
  list: [],
  detail: null,
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

export const UserVehicleSlice = createSlice({
  name: "userVehicle",
  initialState,
  reducers: {
    getUserVehicles(state, action: PayloadAction<UserVehiclePaginationQuery>) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    getUserVehiclesSuccess(
      state,
      action: PayloadAction<GetUserVehicleSuccessPayload>
    ) {
      state.loadingList = false;
      state.list = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    getUserVehiclesFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.list = [];
      state.pagination = undefined;
    },

    getUserVehicleDetail(
      state,
      action: PayloadAction<{ userVehicleId: UserVehicle["_id"] }>
    ) {
      state.loadingSingle = true;
      state.error = null;
    },
    getUserVehicleDetailSuccess(state, action: PayloadAction<UserVehicle>) {
      state.loadingSingle = false;
      state.detail = action.payload;
    },
    getUserVehicleDetailFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.detail = null;
    },

    createUserVehicle(
      state,
      action: PayloadAction<{ userVehicle: UserVehicle }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createUserVehicleSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createUserVehicleFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    updateUserVehicle(
      state,
      action: PayloadAction<{
        userVehicleId: string;
        UserVehicle: UserVehicle;
      }>
    ) {
      state.update.loading = true;
      state.update.success = false;
      state.error = null;
    },
    updateUserVehicleSuccess(state) {
      state.update.loading = false;
      state.update.success = true;
    },
    updateUserVehicleFailure(state, action: PayloadAction<string>) {
      state.update.loading = false;
      state.update.success = false;
      state.error = action.payload;
    },

    deleteUserVehicle(state, action: PayloadAction<{ userVehicleId: string }>) {
      state.deletion.loading = true;
      state.deletion.success = false;
      state.error = null;
    },
    deleteUserVehicleSuccess(state) {
      state.deletion.loading = false;
      state.deletion.success = true;
    },
    deleteUserVehicleFailure(state, action: PayloadAction<string>) {
      state.deletion.loading = false;
      state.deletion.success = false;
      state.error = null;
    },
    resetUserVehicleDetail(state) {
      state.loadingSingle = false;
      state.detail = null;
      state.error = null;
    },

    resetState(state) {
      state.create = { loading: false, success: false };
      state.update = { loading: false, success: false };
      state.deletion = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
      state.loadingList = false;
      state.loadingSingle = false;
      state.list = [];
      state.detail = null;
      state.error = null;
      state.pagination = undefined;
    },
  },
});

export const UserVehicleActions = UserVehicleSlice.actions;
export default UserVehicleSlice.reducer;
