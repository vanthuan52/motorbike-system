import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Banner } from "../types";

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

export const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    getBanners(state) {
      state.loading = true;
      state.error = null;
    },
    getBannersSuccess(state, action: PayloadAction<Banner[]>) {
      state.loading = false;
      state.error = null;
      state.banners = action.payload;
    },
    getBannersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.banners = [];
    },
    reset(state) {
      state.banners = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const bannerActions = bannerSlice.actions;
export default bannerSlice.reducer;
