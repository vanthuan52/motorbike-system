import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ROUTER_PATH } from "@/constants/router-path";
import NotFoundPage from "@/pages/not-found-page";
import AppLayout from "@/layout/app-layout";
import LoginPage from "@/modules/auth/pages/login-page";
import HomePage from "@/pages/home-page";
import AuthLayout from "@/layout/auth-layout";
import ProtectedRoute from "./protected-route";

const PostPage = lazy(() => import("@/modules/posts/pages/post-page"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/dashboard"));
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
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.DASHBOARD,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.EMPLOYEES,
        element: (
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.EMPLOYEES_DETAILS,
        element: (
          <ProtectedRoute>
            <EmployeeDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.POSTS,
        element: (
          <ProtectedRoute>
            <PostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.MESSAGES,
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.VEHICLE_COMPANY,
        element: (
          <ProtectedRoute>
            <VehicleCompanyPage />
          </ProtectedRoute>
        ),
      },
      // { path: ROUTER_PATH.VEHICLE_TYPE, element: <VehicleType /> },
      {
        path: ROUTER_PATH.CATEGORY,
        element: (
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.CATEGORY_DETAILS,
        element: (
          <ProtectedRoute>
            <CategoryDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.CREATE_CATEGORY,
        element: <CreateCategoryPage />,
      },
      {
        path: ROUTER_PATH.CATEGORY,
        element: (
          <ProtectedRoute>
            <VehiclePartsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTER_PATH.VEHICLE_PART}/:action/:id`,
        element: <VehiclePartDetailPage />,
      },
      {
        path: ROUTER_PATH.MAINTENANCE_SCHEDULE,
        element: (
          <ProtectedRoute>
            <MaintenanceSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.MAINTENANCE,
        element: (
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.CUSTOMERS,
        element: (
          <ProtectedRoute>
            <CustomerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${ROUTER_PATH.CUSTOMERS}/:id`,
        element: (
          <ProtectedRoute>
            <CustomerDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.INVOICES,
        element: (
          <ProtectedRoute>
            <InvoicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.INVOICES_DETAILS,
        element: (
          <ProtectedRoute>
            <InvoicesDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.ROLES,
        element: (
          <ProtectedRoute>
            <RolesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.PERMISSIONS,
        element: (
          <ProtectedRoute>
            <PermissionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.PRODUCTS,
        element: (
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.PRODUCTS_DETAILS,
        element: (
          <ProtectedRoute>
            <ProductDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTER_PATH.CREATE_PRODUCT,
        element: (
          <ProtectedRoute>
            <CreateProductPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
