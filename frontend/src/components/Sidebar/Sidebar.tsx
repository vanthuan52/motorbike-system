"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Calendar,
  Wrench,
  Users,
  User,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./styles.css";
import Image from "next/image";

const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/admin/dashboard",
  },
  {
    label: "Quản lý phụ tùng",
    icon: <Package size={18} />,
    children: [
      {
        label: "Loại xe",
        href: "/admin/part-management/vehicle-type",
        icon: <Package size={16} />,
      },
      {
        label: "Hãng xe",
        href: "/admin/part-management/vehicle-company",
        icon: <Package size={16} />,
      },
      {
        label: "Phụ tùng",
        href: "/admin/part-management/vehicle-part",
        icon: <Package size={16} />,
      },
    ],
  },
  {
    label: "Quản lý lịch hẹn",
    icon: <Calendar size={18} />,
    href: "/admin/appointments",
  },
  {
    label: "Quản lý bảo dưỡng",
    icon: <Wrench size={18} />,
    href: "/admin/maintenance",
  },
  {
    label: "Quản lý người dùng",
    icon: <Users size={18} />,
    children: [
      {
        label: "Danh sách người dùng",
        href: "/admin/users",
        icon: <User size={16} />,
      },
      {
        label: "Thêm người dùng",
        href: "/admin/users/add",
        icon: <User size={16} />,
      },
    ],
  },
];
export function SidebarAdmin() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isActive = useCallback(
    (href?: string) => !!href && pathname.startsWith(href),
    [pathname]
  );

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  useEffect(() => {
    const defaultOpenMenus: Record<string, boolean> = {};

    menuItems.forEach((item) => {
      if (
        item.children &&
        item.children.some((child) => isActive(child.href))
      ) {
        defaultOpenMenus[item.label] = true;
      }
    });

    setOpenMenus(defaultOpenMenus);
  }, [pathname, isActive]);
  return (
    <div className="h-screen w-[300px] border-r border-gray-200 flex flex-col bg-white">
      {/* Logo */}
      <Link href="/admin">
        <div className="text-[18px] text-center uppercase py-4 font-bold tracking-wide">
          Motorbike System
        </div>
      </Link>

      {/* Menu */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        {menuItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => toggleMenu(item.label)}
                className="w-full flex items-center justify-between px-3 py-2 font-semibold text-left hover:bg-gray-100 rounded-md text-gray-800 !cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
                {openMenus[item.label] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {openMenus[item.label] && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(child.href)
                          ? "bg-gray-100 text-black"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {child.icon}
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-semibold ${
                isActive(item.href)
                  ? "bg-gray-100 text-black"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        )}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-2">
        <Link
          href="#"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100"
        >
          <Image
            src="/icons/sign-out.svg"
            alt="sign-out"
            width={20}
            height={20}
          />
          Đăng xuất
        </Link>
      </div>
    </div>
  );
}
