import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { LoginFormType } from "../schemas/auth-schema";
import { AuthenticatedUser, User, UserRole } from "../types";
import { localStorageHelper } from "@/utils/local-storage-helper";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user?: AuthenticatedUser;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginFormType>) => {
      state.isAuthenticated = false;
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    getCurrentUser: (state) => {
      state.isLoading = true;
    },
    getCurrentUserSuccess(state, action: PayloadAction<User>) {
      const { accessToken } = localStorageHelper.getAuthToken();
      const { role } = jwtDecode<{ role: UserRole }>(accessToken);
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = { role: role, ...action.payload };
    },
    getCurrentUserFailure(state) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = null;
      state.user = undefined;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
