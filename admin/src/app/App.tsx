import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAppDispatch, useAppSelector } from "@/store";
import { authActions } from "@/modules/auth/store/auth-slice";
import LoadingOverlay from "@/components/ui/loading-overlay";
import ToastProvider from "@/modules/notification/components/toast-provider";
import GlobalLoading from "@/components/ui/global-loading";

function App() {
  const { loading } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.getUserProfile());
  }, []);

  if (loading) return <LoadingOverlay show={true} />;

  return (
    <React.Fragment>
      <RouterProvider router={router}></RouterProvider>
      <ToastProvider />
      <GlobalLoading />
    </React.Fragment>
  );
}

export default App;
