import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { PaginationQuery } from "@/types/base.type";
import { ApiResponsePagination } from "@/types/api.type";

interface UserState {
  users: User[];
  user?: User | null;
  loadingList: boolean;
  error: string | null;
}

interface GetAdminTechnicianSuccessPayload {
  users: User[];
  pagination: ApiResponsePagination | undefined;
}
const initialState: UserState = {
  users: [],
  user: null,
  loadingList: false,
  error: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getAdminTechnicians(state, action: PayloadAction<PaginationQuery>) {
      state.loadingList = true;
      state.error = null;
    },
    getAdminTechniciansSuccess(
      state,
      action: PayloadAction<GetAdminTechnicianSuccessPayload>
    ) {
      state.loadingList = false;
      state.error = null;
      state.users = action.payload.users;
    },
    getAdminTechniciansFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.users = [];
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
