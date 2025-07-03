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
  () => import("@/modules/vehicle-brand/pages/vehicle-brand-page")
);

const PartTypePage = lazy(
  () => import("@/modules/part-types/pages/part-type-page")
);
const PartTypeDetailsPage = lazy(
  () => import("@/modules/part-types/pages/part-type-details-page")
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

const CandidatePage = lazy(
  () => import("@/modules/candidates/pages/candidate-page")
);

const CandidateDetailsPage = lazy(
  () => import("@/modules/candidates/pages/candidate-detail-page")
);

const StorePage = lazy(() => import("@/modules/stores/pages/store-page"));

const StoreDetailsPage = lazy(
  () => import("@/modules/stores/pages/store-details-page")
);
const ServiceCategoryPage = lazy(
  () => import("@/modules/service-category/pages/service-category-page")
);

const ServiceCategoryDetailPage = lazy(
  () => import("@/modules/service-category/pages/service-category-detail-page")
);

const VehicleServicePage = lazy(
  () => import("@/modules/vehicle-service/pages/vehicle-service-page")
);

const VehicleServiceDetailPage = lazy(
  () => import("@/modules/vehicle-service/pages/vehicle-service-detail-page")
);

const VehicleBrandPage = lazy(
  () => import("@/modules/vehicle-brand/pages/vehicle-brand-page")
);

const VehicleBrandDetailPage = lazy(
  () => import("@/modules/vehicle-brand/pages/vehicle-brand-detail-page")
);

const VehicleModelPage = lazy(
  () => import("@/modules/vehicle-model/pages/vehicle-model-page")
);

const VehicleModelDetailPage = lazy(
  () => import("@/modules/vehicle-model/pages/vehicle-model-detail-page")
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
        path: ROUTER_PATH.PART_TYPES,
        element: <PartTypePage />,
      },
      {
        path: ROUTER_PATH.PART_TYPE_DETAILS,
        element: <PartTypeDetailsPage />,
      },
      {
        path: ROUTER_PATH.PART_TYPE_CREATION,
        element: <PartTypeDetailsPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_PARTS,
        element: <VehiclePartsPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_PART_DETAILS,
        element: <VehiclePartDetailPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_PART_CREATION,
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
        path: ROUTER_PATH.CUSTOMERS_CREATION,
        element: <CustomerDetailPage />,
      },
      {
        path: ROUTER_PATH.CUSTOMERS_DETAIL,
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
      {
        path: ROUTER_PATH.CANDIDATE,
        element: <CandidatePage />,
      },
      {
        path: ROUTER_PATH.CANDIDATE_DETAILS,
        element: <CandidateDetailsPage />,
      },
      {
        path: ROUTER_PATH.STORES,
        element: <StorePage />,
      },
      {
        path: ROUTER_PATH.STORE_CREATION,
        element: <StoreDetailsPage />,
      },
      {
        path: ROUTER_PATH.STORE_DETAILS,
        element: <StoreDetailsPage />,
      },
      {
        path: ROUTER_PATH.SERVICE_CATEGORIES,
        element: <ServiceCategoryPage />,
      },
      {
        path: ROUTER_PATH.SERVICE_CATEGORY_CREATION,
        element: <ServiceCategoryDetailPage />,
      },
      {
        path: ROUTER_PATH.SERVICE_CATEGORY_DETAILS,
        element: <ServiceCategoryDetailPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_SERVICES,
        element: <VehicleServicePage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_SERVICE_CREATION,
        element: <VehicleServiceDetailPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_SERVICE_DETAIL,
        element: <VehicleServiceDetailPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_BRANDS,
        element: <VehicleBrandPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_BRAND_CREATION,
        element: <VehicleBrandDetailPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_BRAND_DETAIL,
        element: <VehicleBrandDetailPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_MODELS,
        element: <VehicleModelPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_MODEL_CREATION,
        element: <VehicleModelDetailPage />,
      },
      {
        path: ROUTER_PATH.VEHICLE_MODEL_DETAIL,
        element: <VehicleModelDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
