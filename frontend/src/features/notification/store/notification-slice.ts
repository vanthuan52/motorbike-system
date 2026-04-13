import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotifyPayload {
  message: string;
  type: NotificationType;
}

const initialState: NotifyPayload = {
  message: "",
  type: "info",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notify: (_state, action: PayloadAction<NotifyPayload>) => {
      const { type, message } = action.payload;

      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
        case "warning":
          toast.warning(message);
          break;
      }
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;
