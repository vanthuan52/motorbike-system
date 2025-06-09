import { useState } from "react";
import clsx from "clsx";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoCarSportSharp } from "react-icons/io5";
import { RxDashboard, RxHome } from "react-icons/rx";
import { BiCategoryAlt, BiMessageDetail } from "react-icons/bi";
import { TbSettingsCode } from "react-icons/tb";
import { LiaFileInvoiceSolid, LiaUsersCogSolid } from "react-icons/lia";
import { GrSchedulePlay } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { FiEdit2, FiUsers } from "react-icons/fi";
import { ROUTER_PATH } from "@/constants/router-path";
import SidebarMenu from "./sidebar/sidebar-menu";
import { FaMotorcycle, FaUserShield } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
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
    key: "company",
    icon: <IoCarSportSharp />,
    href: ROUTER_PATH.VEHICLE_COMPANY,
    label: "Hãng xe",
  },
  {
    key: "vehicle-type",
    icon: <BiCategoryAlt />,
    href: ROUTER_PATH.VEHICLE_TYPE,
    label: "Loại xe",
  },
  {
    key: "vehicle-parts",
    icon: <TbSettingsCode />,
    href: ROUTER_PATH.VEHICLE_PART,
    label: "Phụ tùng",
  },
  {
    key: "maintenance-schedule",
    icon: <GrSchedulePlay />,
    href: ROUTER_PATH.MAINTENANCE_SCHEDULE,
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
    children: [
      {
        key: "products",
        icon: <FaMotorcycle />,
        href: ROUTER_PATH.PRODUCTS,
        label: "Sản phẩm",
      },
      {
        key: "create-product",
        icon: <IoMdAdd />,
        href: ROUTER_PATH.CREATE_PRODUCT,
        label: "Thêm sản phẩm",
      },
    ],
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
