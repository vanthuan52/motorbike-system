"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  CalendarOutlined,
  CarOutlined,
  HistoryOutlined,
  UserOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { mockUser } from "@/data/UserProfile";
import clsx from "clsx";

const customerSidebarItems = [
  { label: "Trang chủ", icon: HomeOutlined, href: "/" },
  { label: "Hồ sơ cá nhân", icon: UserOutlined, href: "/ho-so" },
  { label: "Lịch hẹn bảo dưỡng", icon: CalendarOutlined, href: "/lich-hen-bao-duong" },
  { label: "Xe của tôi", icon: CarOutlined, href: "/quan-ly-phuong-tien" },
  { label: "Lịch sử bảo dưỡng", icon: HistoryOutlined, href: "/lich-su-bao-duong" },
  { label: "Cài đặt tài khoản", icon: SettingOutlined, href: "/settings" },
  { label: "Hỗ trợ", icon: CustomerServiceOutlined, href: "/support" },
  { label: "Đăng xuất", icon: LogoutOutlined, href: "/logout" },
];


export default function UserSidebar() {
  const pathname = usePathname();
  const user = mockUser;
  
  return (
    <>
    <aside
    className={clsx(
    "lg:flex fixed top-0 left-6 max-h-screen bg-white rounded-br-xl shadow p-6 flex-col w-85 z-50 transform transition-transform duration-300 hidden",
    "lg:translate-x-0 lg:static"
    )}
>
  <div className="flex items-center gap-4 mb-8 px-1">
    <div className="w-16 h-16 rounded-full border-2 border-violet-600 overflow-hidden">
     <img
      src={user.photo || "images/avatar/default-avatar.jpeg"}
      alt="Avatar"
      width={64}
      height={64}
      className="object-cover"
      />
    </div>
    <div className="text-gray-900 font-semibold text-lg">  {`${user.first_name} ${user.last_name}`}</div>
  </div>

  <nav className="flex flex-col space-y-2">
    {customerSidebarItems.map(({ label, icon: Icon, href }) => {
      const isActive = pathname === href || pathname.startsWith(href + "/");

      return (
        <Link
          key={label}
          href={href}
          className={clsx(
            "flex items-center gap-4 px-4 py-3 rounded-md text-base font-medium transition-colors relative",
            isActive
              ? "bg-violet-50 text-violet-700 font-semibold"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
            "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-tr-md before:rounded-br-md",
            isActive ? "before:bg-violet-600" : "before:bg-transparent"
          )}
        >
          <Icon
            style={{ fontSize: 20 }}
            className={clsx(isActive ? "text-violet-600" : "text-gray-500")}
          />
          <span>{label}</span>
        </Link>
      );
    })}
  </nav>
</aside>

    </>
  );
}
