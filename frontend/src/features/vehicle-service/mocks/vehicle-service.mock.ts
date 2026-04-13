import {
  VehicleService,
  ENUM_VEHICLE_SERVICE_STATUS,
} from "@/features/vehicle-service/types";
import { ENUM_SERVICE_CATEGORY_STATUS } from "@/features/service-category/types";

const DATE = "2024-01-01T00:00:00.000Z" as unknown as Date;

const catMaintenance = {
  _id: "cat-01",
  name: "Bảo dưỡng định kỳ",
  slug: "bao-duong-dinh-ky",
  status: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
  createdAt: DATE,
  updatedAt: DATE,
};

const catRepair = {
  _id: "cat-02",
  name: "Sửa chữa",
  slug: "sua-chua",
  status: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
  createdAt: DATE,
  updatedAt: DATE,
};

const catCare = {
  _id: "cat-03",
  name: "Chăm sóc",
  slug: "cham-soc",
  status: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
  createdAt: DATE,
  updatedAt: DATE,
};

export const mockVehicleServices: VehicleService[] = [
  {
    _id: "vs-001",
    name: "Thay nhớt",
    slug: "thay-nhot",
    description: "Thay nhớt động cơ định kỳ, giúp xe vận hành trơn tru.",
    basePrice: 150000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catMaintenance,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    _id: "vs-002",
    name: "Vệ sinh buồng đốt",
    slug: "ve-sinh-buong-dot",
    description: "Làm sạch buồng đốt, cải thiện hiệu suất động cơ.",
    basePrice: 250000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catMaintenance,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    _id: "vs-003",
    name: "Thay lọc gió",
    slug: "thay-loc-gio",
    description: "Thay thế lọc gió giúp động cơ hít thở tốt hơn.",
    basePrice: 80000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catMaintenance,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    _id: "vs-004",
    name: "Kiểm tra phanh",
    slug: "kiem-tra-phanh",
    description: "Kiểm tra và điều chỉnh hệ thống phanh.",
    basePrice: 120000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catRepair,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    _id: "vs-005",
    name: "Thay nhông sên dĩa",
    slug: "thay-nhong-sen-dia",
    description: "Thay bộ nhông sên dĩa, đảm bảo truyền động ổn định.",
    basePrice: 450000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catRepair,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    _id: "vs-006",
    name: "Rửa xe cao cấp",
    slug: "rua-xe-cao-cap",
    description: "Rửa xe với hóa chất chuyên dụng, phủ nano bảo vệ sơn.",
    basePrice: 200000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catCare,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    _id: "vs-007",
    name: "Kiểm tra tổng quát",
    slug: "kiem-tra-tong-quat",
    description: "Kiểm tra toàn diện tình trạng xe theo 20 hạng mục.",
    basePrice: 350000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catMaintenance,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    _id: "vs-008",
    name: "Thay bugi",
    slug: "thay-bugi",
    description: "Thay thế bugi đánh lửa, cải thiện hiệu suất khởi động.",
    basePrice: 95000,
    status: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    serviceCategory: catRepair,
    createdAt: DATE,
    updatedAt: DATE,
  },
];
