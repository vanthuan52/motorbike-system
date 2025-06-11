/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import {
  CalendarOutlined,
  CarOutlined,
  HistoryOutlined,
  UserOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { LogIn, User2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { ROUTER_PATH } from "@/constant/router-path";
import { UserType } from "@/types/User";
import { CustomLink } from "../CustomerLink/CustomLink";
import { authActions } from "@/features/auth/store/auth-slice";
import { useRouter } from "next/navigation";
import { notificationActions } from "@/features/notification/store/notification-slice";

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
  { label: "Hồ sơ cá nhân", href: ROUTER_PATH.ACCOUNT, icon: <UserOutlined /> },
  {
    label: "Lịch hẹn bảo dưỡng",
    href: ROUTER_PATH.SERVICE_APPOINTMENT,
    icon: <CalendarOutlined />,
  },
  {
    label: "Xe của tôi",
    href: ROUTER_PATH.VEHICLE_MANAGEMENT,
    icon: <CarOutlined />,
  },
  {
    label: "Lịch sử bảo dưỡng",
    href: ROUTER_PATH.SERVICE_HISTORY,
    icon: <HistoryOutlined />,
  },
  {
    label: "Cài đặt tài khoản",
    href: ROUTER_PATH.SETTING,
    icon: <SettingOutlined />,
  },
  {
    label: "Hỗ trợ",
    href: ROUTER_PATH.SUPPORT,
    icon: <CustomerServiceOutlined />,
  },
];

export default function UserAvatar({ user, className }: UserAvatarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  const logout = () => {
    router.push(ROUTER_PATH.HOME);
    dispatch(authActions.logout());
    dispatch(
      notificationActions.notify({
        type: "success",
        message: "Đăng xuất thành công!",
      })
    );
  };

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="rounded-full overflow-hidden border border-gray-300 flex items-center justify-center focus:outline-none p-2"
        aria-label="User menu"
      >
        {user?.photo ? (
          <img
            src={user.photo}
            alt={`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()}
            className="object-cover w-full h-full"
          />
        ) : (
          <User2 className="object-cover" size={18} />
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
          {isAuthenticated ? (
            <>
              {MENU_ITEMS.map(({ label, href, icon }) => (
                <CustomLink
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {icon}
                  <span>{label}</span>
                </CustomLink>
              ))}
              <div
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
                onClick={() => logout()}
              >
                <LogoutOutlined />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <CustomLink
              href={ROUTER_PATH.LOGIN}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-black text-sm cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn size={18} />
              <span>Login</span>
            </CustomLink>
          )}
        </div>
      )}
    </div>
  );
}
