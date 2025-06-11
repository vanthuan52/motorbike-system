import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginCredentials } from "../types";
import { UserProfile } from "@/features/user/types";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginCredentials: (state, action: PayloadAction<LoginCredentials>) => {
      state.isAuthenticated = false;
      state.loading = true;
      state.error = null;
    },
    loginCredentialsSuccess: (state) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginCredentialsFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },

    register: (state, action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    getUserProfile: (state) => {
      state.loading = true;
      state.error = null;
    },

    getUserProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    getUserProfileFailure: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },

    logout: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    logoutFailure: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
