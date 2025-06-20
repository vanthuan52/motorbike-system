import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehicleCompanyTypes } from "../types";

interface VehicleCompanyState {
  companies: VehicleCompanyTypes[];     
  total: number;                         
  isLoading: boolean;
  error: string | null;
}

const initialState: VehicleCompanyState = {
  companies: [],
  total: 0,
  isLoading: false,
  error: null,
};

export const vehicleCompanySlice = createSlice({
  name: "vehicleCompany",
  initialState,
  reducers: {
    fetchCompaniesRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchCompaniesSuccess(state, action: PayloadAction<VehicleCompanyTypes[]>) {
      state.isLoading = false;
      state.companies = action.payload;
    },
    fetchCompaniesFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    createCompanyRequest(state, _action: PayloadAction<Omit<VehicleCompanyTypes, "id">>) {
      state.isLoading = true;
      state.error = null;
    },
    updateCompanyRequest(
      state,
      _action: PayloadAction<{ id: string; data: Omit<VehicleCompanyTypes, "id"> }>
    ) {
      state.isLoading = true;
      state.error = null;
    },
    deleteCompanyRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.error = null;
    },

    operationSuccess(state) {
      state.isLoading = false;
    },
    operationFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const vehicleCompanyActions = vehicleCompanySlice.actions;
export default vehicleCompanySlice.reducer;
