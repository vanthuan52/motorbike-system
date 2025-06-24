import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAppSelector } from "@/store";
import ToastProvider from "@/modules/notification/components/toast-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function App() {
  const { appLoading } = useAppSelector((state) => state.auth);

  if (appLoading) {
    return <LoadingSpinner overlay />;
  }

  return (
    <React.Fragment>
      <RouterProvider router={router}></RouterProvider>
      <ToastProvider />
    </React.Fragment>
  );
}

export default App;
