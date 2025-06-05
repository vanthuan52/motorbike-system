"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { UserType } from "@/types/User";

import {
  CalendarOutlined,
  CarOutlined,
  HistoryOutlined,
  UserOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

interface UserAvatarProps {
  user?: UserType | null;
  className?: string;
}

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Hồ sơ cá nhân", href: "/ho-so", icon: <UserOutlined /> },
  { label: "Lịch hẹn bảo dưỡng", href: "/lich-hen-bao-duong", icon: <CalendarOutlined /> },
  { label: "Xe của tôi", href: "/quan-ly-phuong-tien", icon: <CarOutlined /> },
  { label: "Lịch sử bảo dưỡng", href: "/lich-su-bao-duong", icon: <HistoryOutlined /> },
  { label: "Cài đặt tài khoản", href: "/cai-dat", icon: <SettingOutlined /> },
  { label: "Hỗ trợ", href: "/ho-tro", icon: <CustomerServiceOutlined  /> },
  { label: "Đăng xuất", href: "/logout", icon: <LogoutOutlined  /> },
];

export default function UserAvatar({ user, className }: UserAvatarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center focus:outline-none"
        aria-label="User menu"
      >
        {user?.photo ? (
          <img
            src={user.photo}
            alt={`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()}
            className="object-cover w-full h-full"
          />
        ) : (
          <img
            src="/images/avatar/default-avatar.jpeg"
            alt="Default avatar"
            className="object-cover w-full h-full"
        />
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
          {MENU_ITEMS.map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
