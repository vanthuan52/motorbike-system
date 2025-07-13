import { useState } from "react";
import clsx from "clsx";
import { LayoutList, ScrollText } from "lucide-react";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoCarSportSharp } from "react-icons/io5";
import { RxDashboard, RxHome } from "react-icons/rx";
import { BiCategoryAlt, BiMessageDetail, BiTask } from "react-icons/bi";
import { TbSettingsCode } from "react-icons/tb";
import { LiaFileInvoiceSolid, LiaUsersCogSolid } from "react-icons/lia";
import { GrSchedulePlay } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { FiEdit2, FiUsers } from "react-icons/fi";
import { ROUTER_PATH } from "@/constants/router-path";
import SidebarMenu from "./sidebar/sidebar-menu";
import {
  FaBriefcase,
  FaMotorcycle,
  FaStore,
  FaUserShield,
} from "react-icons/fa";

const menuItems = [
  {
    key: "Home",
    icon: <RxHome />,
    href: ROUTER_PATH.INDEX,
    label: "Home",
  },
  {
    key: "dashboard",
    icon: <RxDashboard />,
    href: ROUTER_PATH.DASHBOARD,
    label: "Dashboard",
  },
  {
    key: "messages",
    icon: <BiMessageDetail />,
    href: ROUTER_PATH.MESSAGES,
    label: "Tin nhắn",
  },
  {
    key: "vehicle-brand",
    icon: <IoCarSportSharp />,
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
    key: "service-categories",
    icon: <LayoutList />,
    href: ROUTER_PATH.SERVICE_CATEGORIES,
    label: "Danh mục dịch vụ",
  },
  {
    key: "vehicle-services",
    icon: <ScrollText />,
    href: ROUTER_PATH.VEHICLE_SERVICES,
    label: "Dịch vụ xe máy",
  },
  {
    key: "service-prices",
    icon: <ScrollText />,
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
    key: "roles-permissions",
    icon: <FaUserShield />,
    label: "Phân quyền",
    children: [
      {
        key: "roles-permissions",
        icon: <FiUsers />,
        href: ROUTER_PATH.ROLES,
        label: "Vai trò",
      },
      {
        key: "roles-permissions",
        icon: <TbSettingsCode />,
        href: ROUTER_PATH.PERMISSIONS,
        label: "Quyền",
      },
    ],
  },
  {
    key: "products",
    icon: <FaMotorcycle />,
    label: "Sản phẩm",
    href: ROUTER_PATH.PRODUCTS,
  },
  {
    key: "hirings",
    icon: <FaBriefcase />,
    label: "Tuyển dụng",
    href: ROUTER_PATH.HIRING,
  },
  {
    key: "stores",
    icon: <FaStore />,
    label: "Cửa hàng",
    href: ROUTER_PATH.STORES,
  },
];

const DesktopSidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={clsx(
        "h-screen bg-white shadow-sm hidden flex-col transition-all duration-300 border-r border-r-[#ddd] md:flex",
        sidebarCollapsed ? "w-13" : "!w-64 !min-w-64"
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 h-16">
        {!sidebarCollapsed && (
          <span className="font-bold text-md md:text-lg">Logo name.</span>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-xl cursor-pointer"
        >
          <CgMenuRightAlt />
        </button>
      </div>

      <SidebarMenu
        items={menuItems}
        collapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </div>
  );
};

export default DesktopSidebar;
