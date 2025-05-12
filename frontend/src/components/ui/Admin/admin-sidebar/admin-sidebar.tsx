"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoCarSportSharp } from "react-icons/io5";
import { RxDashboard, RxHome } from "react-icons/rx";
import { BiCategoryAlt, BiMessageDetail } from "react-icons/bi";
import { TbSettingsCode } from "react-icons/tb";
import { LiaUsersCogSolid } from "react-icons/lia";
import { GrSchedulePlay } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { ROUTER_PATH } from "@/constant/router-path";
import SidebarMenu from "./sidebar-menu";

const menuItems = [
  {
    key: "Home",
    icon: <RxHome />,
    href: ROUTER_PATH.ADMIN.INDEX,
    label: "Home",
  },
  {
    key: "dashboard",
    icon: <RxDashboard />,
    href: ROUTER_PATH.ADMIN.DASHBOARD,
    label: "Dashboard",
  },
  {
    key: "messages",
    icon: <BiMessageDetail />,
    href: ROUTER_PATH.ADMIN.MESSAGES,
    label: "Tin nhắn",
  },
  {
    key: "brand",
    icon: <IoCarSportSharp />,
    href: ROUTER_PATH.ADMIN.VEHICLE_BRAND,
    label: "Hãng xe",
  },
  {
    key: "vehicle-type",
    icon: <BiCategoryAlt />,
    href: ROUTER_PATH.ADMIN.VEHICLE_TYPE,
    label: "Loại xe",
  },
  {
    key: "vehicle-parts",
    icon: <TbSettingsCode />,
    href: ROUTER_PATH.ADMIN.VEHICLE_PART,
    label: "Phụ tùng",
  },
  {
    key: "maintainance-schedule",
    icon: <GrSchedulePlay />,
    href: ROUTER_PATH.ADMIN.APPOINTMENTS,
    label: "Lịch hẹn",
  },
  {
    key: "maintainance",
    icon: <AiOutlineSchedule />,
    href: ROUTER_PATH.ADMIN.MAINTENANCE,
    label: "Bảo dưỡng",
  },

  {
    key: "customers",
    icon: <FiUsers />,
    href: ROUTER_PATH.ADMIN.CUSTOMERS,
    label: "Quản lý khách hàng",
  },
  {
    key: "staffs",
    icon: <LiaUsersCogSolid />,
    href: ROUTER_PATH.ADMIN.EMPLOYEES,
    label: "Quản lý nhân viên",
  },
];

const AdminSidebar = () => {
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

export default AdminSidebar;
