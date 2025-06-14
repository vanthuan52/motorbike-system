import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAppDispatch } from "@/store";
import { authActions } from "@/modules/auth/store/auth-slice";
import ToastProvider from "@/modules/notification/components/toast-provider";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.getUserProfile());
  }, []);

  return (
    <React.Fragment>
      <RouterProvider router={router}></RouterProvider>
      <ToastProvider />
    </React.Fragment>
  );
}

export default App;
