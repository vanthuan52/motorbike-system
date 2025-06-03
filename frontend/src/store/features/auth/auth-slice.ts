import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user?: any; // need to fix
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
    // // need to fix
    login: (state, action: PayloadAction<any>) => {
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

    register: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
