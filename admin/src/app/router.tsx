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
const EmployeeDetailsPage = lazy(
  () => import("@/modules/employees/pages/employees-detail-page")
)
const MessagesPage = lazy(
  () => import("@/modules/messages/pages/messages-page")
);
const VehicleCompanyPage = lazy(
  () => import("@/modules/vehicle-company/pages/vehicle-company-page")
);
const VehicleType = lazy(
  () => import("@/modules/vehicle-type/pages/vehicle-type-page")
);

const VehiclePartsPage = lazy(
  () => import("@/modules/vehicle-parts/pages/vehicle-part-page")
);

const CustomerPage = lazy(
  () => import("@/modules/customer-management/pages/customer-page")
);

const CustomerDetailPage = lazy(
  () => import("@/modules/customer-management/pages/customer-detail-page")
);
const InvoicesPage = lazy(
  () => import("@/modules/invoice-management/pages/invoices-page")
);
const InvoicesDetailPage = lazy(
  () => import("@/modules/invoice-management/pages/invoices-details-page")
);
const RolesPage = lazy(
  () =>
    import("@/modules/roles-permissions/pages/roles-page")
)
const PermissionsPage = lazy(
  () =>
    import("@/modules/roles-permissions/pages/permissions-page")
)
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
      { path: ROUTER_PATH.EMPLOYEES_DETAILS, element: <EmployeeDetailsPage /> },
      { path: ROUTER_PATH.POSTS, element: <PostPage /> },
      { path: ROUTER_PATH.MESSAGES, element: <MessagesPage /> },
      { path: ROUTER_PATH.VEHICLE_COMPANY, element: <VehicleCompanyPage /> },
      { path: ROUTER_PATH.VEHICLE_TYPE, element: <VehicleType /> },
      { path: ROUTER_PATH.VEHICLE_PART, element: <VehiclePartsPage /> },
      { path: ROUTER_PATH.CUSTOMERS, element: <CustomerPage /> },
      {
        path: `${ROUTER_PATH.CUSTOMERS}/:id`,
        element: <CustomerDetailPage />,
      },
      { path: ROUTER_PATH.INVOICES, element: <InvoicesPage /> },
      {
        path: ROUTER_PATH.INVOICES_DETAILS,
        element: <InvoicesDetailPage />,
      },
      {
        path: ROUTER_PATH.ROLES,
        element: (
          <RolesPage />
        ),
      },
      {
        path: ROUTER_PATH.PERMISSIONS,
        element: (
          <PermissionsPage />
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
