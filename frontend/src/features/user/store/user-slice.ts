import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types";

interface UserState {
  user?: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
