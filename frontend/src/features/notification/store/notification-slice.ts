import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast, ToastOptions } from "react-toastify";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotifyPayload {
  message: string;
  type: NotificationType;
  options?: ToastOptions;
}

const initialState: NotifyPayload = {
  message: "",
  type: "info",
  options: undefined,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notify: (_state, action: PayloadAction<NotifyPayload>) => {
      const { type, message, options } = action.payload;

      switch (type) {
        case "success":
          toast.success(message, options);
          break;
        case "error":
          toast.error(message, options);
          break;
        case "info":
          toast.info(message, options);
          break;
        case "warning":
          toast.warn(message, options);
          break;
      }
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;
