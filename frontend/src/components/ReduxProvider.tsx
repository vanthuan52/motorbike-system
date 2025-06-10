"use client";

import { Provider } from "react-redux";
import { RootState, store } from "../store";

interface ReduxProviderProps {
  children: React.ReactNode;
  initialState?: RootState;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
