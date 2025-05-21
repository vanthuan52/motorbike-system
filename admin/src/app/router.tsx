import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import NotFoundPage from "@/pages/not-found-page";
import AppLayout from "@/layout/app-layout";
import ProtectedRoute from "./protected-route";

const HomePage = lazy(() => import("@/pages/home-page"));
const PostPage = lazy(() => import("@/modules/posts/pages/post-page"));
const LoginPage = lazy(() => import("@/modules/auth/pages/login-page"));
const EmployeesPage = lazy(
  () => import("@/modules/employees/pages/employees-page")
);
const MessagesPage = lazy(
  () => import("@/modules/messages/pages/messages-page")
);
const VehicleCompanyPage = lazy(
  () => import("@/modules/vehicle-company/pages/vehicle-company-page")
);
const VehicleType = lazy(
  () => import("@/modules/vehicle-type/pages/vehicle-type-page")
);
export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTER_PATH.INDEX,
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTER_PATH.EMPLOYEES, element: <EmployeesPage /> },
      { path: ROUTER_PATH.POSTS, element: <PostPage /> },
      { path: ROUTER_PATH.MESSAGES, element: <MessagesPage /> },
      { path: ROUTER_PATH.VEHICLE_COMPANY, element: <VehicleCompanyPage /> },
      { path: ROUTER_PATH.VEHICLE_TYPE, element: <VehicleType /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
