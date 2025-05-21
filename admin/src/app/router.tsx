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
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
