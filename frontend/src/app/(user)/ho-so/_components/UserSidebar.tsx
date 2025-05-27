"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarClock,
  Car,
  History,
  User,
  Settings,
  MessageSquare,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const customerSidebarItems = [
  { label: "Trang chủ", icon: Home, href: "/" },
  { label: "Hồ sơ cá nhân", icon: User, href: "/ho-so" },
  { label: "Lịch hẹn bảo dưỡng", icon: CalendarClock, href: "/schedule" },
  { label: "Xe của tôi", icon: Car, href: "/quan-ly-phuong-tien" },
  {
    label: "Lịch sử bảo dưỡng",
    icon: History,
    href: "/maintenance-history",
  },
  { label: "Cài đặt tài khoản", icon: Settings, href: "/settings" },
  { label: "Hỗ trợ", icon: MessageSquare, href: "/support" },
  { label: "Đăng xuất", icon: LogOut, href: "/logout" },
];

export default function UserSidebar() {
  const pathname = usePathname();

  const user = {
    name: "Nguyễn Văn A",
    avatarUrl: "/images/avatar/avatar1.jpeg",
  };

  return (
    <aside className="w-64 min-h-screen bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-12 h-12 rounded-full border-2 border-violet-600 overflow-hidden">
          <Image
            src={user.avatarUrl}
            alt="Avatar"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="text-gray-900 font-semibold text-base">{user.name}</div>
      </div>

      <nav className="flex flex-col space-y-1">
        {customerSidebarItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={label}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-tr-md before:rounded-br-md",
                isActive ? "before:bg-violet-600" : "before:bg-transparent"
              )}
            >
              <Icon
                className={clsx(
                  "w-4 h-4",
                  isActive ? "text-violet-600" : "text-gray-500"
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
