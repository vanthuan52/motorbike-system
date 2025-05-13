"use client";
import React, { useCallback } from "react";
import { LayoutDashboard, Calendar, Wrench, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./styles.css";

const technicianMenuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/technician/dashboard",
  },
  {
    label: "Lịch hẹn",
    icon: <Calendar size={18} />,
    href: "/technician/appointments",
  },
  {
    label: "Bảo dưỡng",
    icon: <Wrench size={18} />,
    href: "/technician/maintenance",
  },
  {
    label: "Tài khoản",
    icon: <User size={18} />,
    href: "/technician/profile",
  },
];

export function SidebarTechnician() {
  const pathname = usePathname();

  const isActive = useCallback(
    (href?: string) => !!href && pathname.startsWith(href),
    [pathname]
  );

  return (
    <div className="h-screen w-[256px] border-r border-gray-200 flex flex-col bg-white">
      {/* Logo */}
      <Link href="/technician">
        <div className="text-[18px] text-center uppercase py-4 font-bold tracking-wide">
          Motorbike System
        </div>
      </Link>

      {/* Menu */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        {technicianMenuItems.map((item) => (
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
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-2">
        <Link
          href="#"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100"
        >
          <LogOut size={20} />
          Đăng xuất
        </Link>
      </div>
    </div>
  );
}
