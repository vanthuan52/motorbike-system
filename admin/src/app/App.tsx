import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { router } from "./router";
import { useAppDispatch, useAppSelector } from "@/store";
import { authActions } from "@/modules/auth/store/auth-slice";
import LoadingOverlay from "@/components/ui/loading-overlay";

function App() {
  const { isLoading } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.getCurrentUser());
  }, []);

  if (isLoading) return <LoadingOverlay show={true} />;

  return (
    <React.Fragment>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment>
  );
}

export default App;
