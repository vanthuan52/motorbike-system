import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import NotFoundPage from "@/pages/not-found-page";
import AppLayout from "@/layout/app-layout";
import LoginPage from "@/modules/auth/pages/login-page";
import HomePage from "@/pages/home-page";
import Dashboard from "@/modules/dashboard/pages/dashboard";
import AuthLayout from "@/layout/auth-layout";
import ProtectedRoute from "./protected-route";
import { VehiclePartDetailPage } from "@/modules/vehicle-parts/pages/vehicle-part-detail-page";
import VehicleTypes from "@/modules/vehicle-type/pages/vehicle-type-page";

const PostPage = lazy(() => import("@/modules/posts/pages/post-page"));
const EmployeesPage = lazy(
  () => import("@/modules/employees/pages/employees-page")
);
const EmployeeDetailsPage = lazy(
  () => import("@/modules/employees/pages/employees-detail-page")
);
const MessagesPage = lazy(
  () => import("@/modules/messages/pages/messages-page")
);
const VehicleCompanyPage = lazy(
  () => import("@/modules/vehicle-company/pages/vehicle-company-page")
);
// const VehicleType = lazy(
//   () => import("@/modules/vehicle-type/pages/vehicle-type-page")
// );
const CategoryPage = lazy(() => import("@/modules/category/pages/category"));
const CategoryDetailsPage = lazy(
  () => import("@/modules/category/pages/category-details-page")
);
const CreateCategoryPage = lazy(
  () => import("@/modules/category/pages/create-category-page")
);
const VehiclePartsPage = lazy(
  () => import("@/modules/vehicle-parts/pages/vehicle-part-page")
);

const MaintenanceSchedule = lazy(
  () => import("@/modules/maintenance-schedule/pages/maintenance-schedule")
);

const Maintenance = lazy(
  () => import("@/modules/maintenance/pages/maintenance")
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
  () => import("@/modules/roles-permissions/pages/roles-page")
);
const PermissionsPage = lazy(
  () => import("@/modules/roles-permissions/pages/permissions-page")
);
const ProductsPage = lazy(
  () => import("@/modules/products/pages/products-page")
);
const ProductDetailsPage = lazy(
  () => import("@/modules/products/pages/product-details-page")
);
const CreateProductPage = lazy(
  () => import("@/modules/products/pages/create-product-page")
);
const HiringPage = lazy(() => import("@/modules/hiring/pages/hiring-page"));
const HiringDetailsPage = lazy(
  () => import("@/modules/hiring/pages/hiring-details-page")
);
const CreateHiringPage = lazy(
  () => import("@/modules/hiring/pages/create-hiring-page")
);
export const router = createBrowserRouter([
  {
    path: ROUTER_PATH.LOGIN,
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: ROUTER_PATH.INDEX,
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTER_PATH.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTER_PATH.EMPLOYEES,
        element: <EmployeesPage />,
      },
      {
        path: ROUTER_PATH.EMPLOYEES_DETAILS,
        element: <EmployeeDetailsPage />,
      },
      {
        path: ROUTER_PATH.POSTS,
        element: <PostPage />,
      },
      {
        path: ROUTER_PATH.MESSAGES,
        element: <MessagesPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_COMPANY,
        element: <VehicleCompanyPage />,
      },
      { path: ROUTER_PATH.VEHICLE_TYPE, element: <VehicleTypes /> },
      {
        path: ROUTER_PATH.CATEGORY,
        element: <CategoryPage />,
      },
      {
        path: ROUTER_PATH.CATEGORY_DETAILS,
        element: <CategoryDetailsPage />,
      },
      {
        path: ROUTER_PATH.CREATE_CATEGORY,
        element: <CreateCategoryPage />,
      },
      {
        path: ROUTER_PATH.CATEGORY,
        element: <VehiclePartsPage />,
      },
      {
        path: `${ROUTER_PATH.VEHICLE_TYPE}/:action/:id`,
        element: <VehiclePartDetailPage />,
      },
      {
        path: ROUTER_PATH.MAINTENANCE_SCHEDULE,
        element: <MaintenanceSchedule />,
      },
      {
        path: ROUTER_PATH.MAINTENANCE,
        element: <Maintenance />,
      },
      {
        path: ROUTER_PATH.CUSTOMERS,
        element: <CustomerPage />,
      },
      {
        path: `${ROUTER_PATH.CUSTOMERS}/:id`,
        element: <CustomerDetailPage />,
      },
      {
        path: ROUTER_PATH.INVOICES,
        element: <InvoicesPage />,
      },
      {
        path: ROUTER_PATH.INVOICES_DETAILS,
        element: <InvoicesDetailPage />,
      },
      {
        path: ROUTER_PATH.ROLES,
        element: <RolesPage />,
      },
      {
        path: ROUTER_PATH.PERMISSIONS,
        element: <PermissionsPage />,
      },
      {
        path: ROUTER_PATH.PRODUCTS,
        element: <ProductsPage />,
      },
      {
        path: ROUTER_PATH.PRODUCTS_DETAILS,
        element: <ProductDetailsPage />,
      },
      {
        path: ROUTER_PATH.CREATE_PRODUCT,
        element: <CreateProductPage />,
      },
      {
        path: ROUTER_PATH.HIRING,
        element: <HiringPage />,
      },
      {
        path: ROUTER_PATH.HIRING_DETAILS,
        element: <HiringDetailsPage />,
      },
      {
        path: ROUTER_PATH.CREATE_HIRING,
        element: <CreateHiringPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
