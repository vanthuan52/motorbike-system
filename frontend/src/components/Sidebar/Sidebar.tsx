"use client";
import React, { useEffect, useState } from "react";
import { Button, Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { Wrench } from "lucide-react";

const menuItems = [
  {
    key: "/admin/dashboard",
    icon: <DashboardOutlined />,
    label: <CustomLink href="/admin/dashboard">Dashboard</CustomLink>,
  },
  {
    key: "part-management",
    icon: <SettingOutlined />,
    label: "Quản lý phụ tùng",
    children: [
      {
        key: "/admin/part-management/vehicle-type",
        icon: <AppstoreOutlined />,
        label: (
          <CustomLink href="/admin/part-management/vehicle-type">
            Loại xe
          </CustomLink>
        ),
      },
      {
        key: "/admin/part-management/vehicle-company",
        icon: <AppstoreOutlined />,
        label: (
          <CustomLink href="/admin/part-management/vehicle-company">
            Hãng xe
          </CustomLink>
        ),
      },
      {
        key: "/admin/part-management/vehicle-part",
        icon: <Wrench size={14} />,
        label: (
          <CustomLink href="/admin/part-management/vehicle-part">
            Phụ tùng
          </CustomLink>
        ),
      },
    ],
  },
  {
    key: "/admin/appointments",
    icon: <CalendarOutlined />,
    label: <CustomLink href="/admin/appointments">Quản lý lịch hẹn</CustomLink>,
  },
  {
    key: "/admin/maintenance",
    icon: <ToolOutlined />,
    label: <CustomLink href="/admin/maintenance">Quản lý bảo dưỡng</CustomLink>,
  },
  {
    key: "user-management",
    icon: <UsergroupAddOutlined />,
    label: "Quản lý người dùng",
    children: [
      {
        key: "/admin/users",
        icon: <UserOutlined />,
        label: (
          <CustomLink href="/admin/users">Danh sách người dùng</CustomLink>
        ),
      },
      {
        key: "/admin/users/add",
        icon: <UserAddOutlined />,
        label: <CustomLink href="/admin/users/add">Thêm người dùng</CustomLink>,
      },
    ],
  },
];
export function SidebarAdmin({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { Sider } = Layout;
  const pathname = usePathname();
  const getOpenKeys = () => {
    if (pathname.startsWith("/admin/part-management"))
      return ["part-management"];
    if (pathname.startsWith("/admin/users")) return ["user-management"];
    return [];
  };
  const selectedKeys = [
    pathname.startsWith("/admin/part-management/vehicle-type") &&
      "/admin/part-management/vehicle-type",
    pathname.startsWith("/admin/part-management/vehicle-company") &&
      "/admin/part-management/vehicle-company",
    pathname.startsWith("/admin/part-management/vehicle-part") &&
      "/admin/part-management/vehicle-part",
    pathname.startsWith("/admin/dashboard") && "/admin/dashboard",
    pathname.startsWith("/admin/appointments") && "/admin/appointments",
    pathname.startsWith("/admin/maintenance") && "/admin/maintenance",
    pathname.startsWith("/admin/users/add") && "/admin/users/add",
    pathname.startsWith("/admin/users") && "/admin/users",
  ].filter(Boolean) as string[];
  const [collapsedWidth, setCollapsedWidth] = useState(80);
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  useEffect(() => {
    setInternalCollapsed(collapsed);
  }, [collapsed]);
  return (
    <Sider
      className="!bg-white border-r border-gray-200 z-100 !transition-all !duration-300 !ease-in-out
        !fixed sm:!sticky top-0 left-0
        !w-[240px] sm:!w-auto
        !h-[100dvh]
        !overflow-y-auto"
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        transition: "all 0.3s",
      }}
      collapsible
      collapsed={internalCollapsed}
      trigger={null}
      breakpoint="sm"
      collapsedWidth={collapsedWidth}
      onBreakpoint={(broken) => {
        setCollapsedWidth(broken ? 0 : 80);
        setInternalCollapsed(broken ? true : collapsed);
      }}
    >
      <div className="flex justify-between items-center w-full sticky top-0 bg-white z-10">
        <div
          style={{
            textAlign: "center",
            padding: 16,
            fontWeight: 700,
            fontSize: 18,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <CustomLink href="/admin">
            {internalCollapsed ? (
              <span className="sr-only">Motorbike System</span>
            ) : (
              <div className="text-[18px] !text-black !font-semibold">
                Motorbike System
              </div>
            )}
          </CustomLink>
        </div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="!block md:!hidden"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
      </div>

      <Menu
        mode="inline"
        items={menuItems}
        defaultOpenKeys={getOpenKeys()}
        selectedKeys={selectedKeys}
        style={{ borderRight: 0, background: "#fff" }}
        inlineCollapsed={internalCollapsed}
      />
      <div className="bottom-0 sticky p-4 flex items-center justify-center w-full bg-white z-10">
        <CustomLink
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontWeight: 600,
            color: "#444",
          }}
        >
          {internalCollapsed ? (
            <LogoutOutlined />
          ) : (
            <>
              <LogoutOutlined /> Đăng xuất
            </>
          )}
        </CustomLink>
      </div>
    </Sider>
  );
}
