import { RxHome, RxDashboard } from "react-icons/rx";
import { BiMessageDetail, BiCategoryAlt, BiTask } from "react-icons/bi";
import { LuLayoutList } from "react-icons/lu";
import { LuScrollText } from "react-icons/lu";
import { TbSettingsCode } from "react-icons/tb";
import { GrSchedulePlay } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { FiUsers, FiEdit2 } from "react-icons/fi";
import { LiaUsersCogSolid, LiaFileInvoiceSolid } from "react-icons/lia";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import {
  FaUserShield,
  FaMotorcycle,
  FaBriefcase,
  FaStore,
  FaUserAlt,
} from "react-icons/fa";
import { ROUTER_PATH } from "@/constants/router-path";
import { RiMotorbikeFill } from "react-icons/ri";

const menuItems = [
  {
    key: "group-dashboard",
    label: "Tổng quan",
    icon: <RxDashboard />,
    href: "",
    children: [
      {
        key: "dashboard",
        icon: <RxDashboard />,
        href: ROUTER_PATH.INDEX,
        label: "Dashboard",
      },
      {
        key: "messages",
        icon: <BiMessageDetail />,
        href: ROUTER_PATH.MESSAGES,
        label: "Tin nhắn",
      },
    ],
  },

  {
    key: "group-vehicle",
    label: "Quản lý xe",
    icon: <FaMotorcycle />,
    href: "",
    children: [
      {
        key: "vehicle-brand",
        icon: <GiFullMotorcycleHelmet />,
        href: ROUTER_PATH.VEHICLE_BRANDS,
        label: "Hãng xe",
      },
      {
        key: "vehicle-model",
        icon: <BiCategoryAlt />,
        href: ROUTER_PATH.VEHICLE_MODELS,
        label: "Dòng xe",
      },
      {
        key: "user-vehicles",
        icon: <RiMotorbikeFill />,
        href: ROUTER_PATH.USER_VEHICLE,
        label: "Xe của khách hàng",
      },
      {
        key: "products",
        icon: <RiMotorbikeFill />,
        href: ROUTER_PATH.PRODUCTS,
        label: "Sản phẩm",
      },
    ],
  },

  {
    key: "group-service",
    label: "Dịch vụ & Phụ tùng",
    icon: <LuLayoutList />,
    href: "",
    children: [
      {
        key: "service-categories",
        icon: <LuLayoutList />,
        href: ROUTER_PATH.SERVICE_CATEGORIES,
        label: "Danh mục dịch vụ",
      },
      {
        key: "vehicle-services",
        icon: <LuScrollText />,
        href: ROUTER_PATH.VEHICLE_SERVICES,
        label: "Dịch vụ xe máy",
      },
      {
        key: "service-prices",
        icon: <LuScrollText />,
        href: ROUTER_PATH.SERVICE_PRICES,
        label: "Giá dịch vụ",
      },
      {
        key: "service-checklist",
        icon: <BiTask />,
        href: ROUTER_PATH.SERVICE_CHECKLIST,
        label: "Danh sách công việc",
      },
      {
        key: "part-types",
        icon: <TbSettingsCode />,
        href: ROUTER_PATH.PART_TYPES,
        label: "Danh mục phụ tùng",
      },
      {
        key: "vehicle-parts",
        icon: <TbSettingsCode />,
        href: ROUTER_PATH.VEHICLE_PARTS,
        label: "Phụ tùng",
      },
      {
        key: "maintenance-schedule",
        icon: <GrSchedulePlay />,
        href: ROUTER_PATH.APPOINTMENTS,
        label: "Lịch hẹn",
      },
      {
        key: "maintainance",
        icon: <AiOutlineSchedule />,
        href: ROUTER_PATH.MAINTENANCE,
        label: "Bảo dưỡng",
      },
    ],
  },

  {
    key: "group-user",
    label: "Khách hàng & Nhân viên",
    icon: <FiUsers />,
    href: "",
    children: [
      {
        key: "customers",
        icon: <FiUsers />,
        href: ROUTER_PATH.CUSTOMERS,
        label: "Quản lý khách hàng",
      },
      {
        key: "staffs",
        icon: <LiaUsersCogSolid />,
        href: ROUTER_PATH.EMPLOYEES,
        label: "Quản lý nhân viên",
      },
      {
        key: "care-records",
        icon: <FaUserAlt />,
        href: ROUTER_PATH.CARE_RECORDS,
        label: "Hồ sơ chăm sóc",
      },
    ],
  },

  {
    key: "group-system",
    label: "Nội dung & Hệ thống",
    icon: <FiEdit2 />,
    href: "",
    children: [
      {
        key: "posts",
        icon: <FiEdit2 />,
        href: ROUTER_PATH.POSTS,
        label: "Quản lý bài viết",
      },
      {
        key: "invoices",
        icon: <LiaFileInvoiceSolid />,
        href: ROUTER_PATH.INVOICES,
        label: "Quản lý hóa đơn",
      },
      {
        key: "roles",
        icon: <FaUserShield />,
        href: ROUTER_PATH.ROLES,
        label: "Vai trò",
      },
      {
        key: "permissions",
        icon: <FaUserShield />,
        href: ROUTER_PATH.PERMISSIONS,
        label: "Quyền",
      },
      {
        key: "hirings",
        icon: <FaBriefcase />,
        href: ROUTER_PATH.HIRING,
        label: "Tuyển dụng",
      },
      {
        key: "stores",
        icon: <FaStore />,
        href: ROUTER_PATH.STORES,
        label: "Cửa hàng",
      },
    ],
  },
];

export default menuItems;
