/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { authActions } from "@/features/auth/store/auth-slice";
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

export default function UserAvatar({ user, className }: UserAvatarProps) {
  const t = useTranslations(`${TRANSLATION_FILES.COMMON}.userMenu`);
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
        message: t("logoutSuccess"),
      })
    );
  };

  const MENU_ITEMS: MenuItem[] = [
    { label: t("profile"), href: ROUTER_PATH.ACCOUNT, icon: <UserOutlined /> },
    {
      label: t("appointments"),
      href: ROUTER_PATH.SERVICE_APPOINTMENT,
      icon: <CalendarOutlined />,
    },
    {
      label: t("myVehicles"),
      href: ROUTER_PATH.VEHICLE_MANAGEMENT,
      icon: <CarOutlined />,
    },
    {
      label: t("history"),
      href: ROUTER_PATH.SERVICE_HISTORY,
      icon: <HistoryOutlined />,
    },
    {
      label: t("settings"),
      href: ROUTER_PATH.SETTING,
      icon: <SettingOutlined />,
    },
    {
      label: t("support"),
      href: ROUTER_PATH.SUPPORT,
      icon: <CustomerServiceOutlined />,
    },
  ];

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="rounded-full overflow-hidden border border-border-strong flex items-center justify-center focus:outline-none p-2"
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
        <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-lg border border-border overflow-hidden z-50">
          {isAuthenticated ? (
            <>
              {MENU_ITEMS.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-100 text-text-secondary text-sm cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
              <div
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-100 text-text-secondary text-sm cursor-pointer"
                onClick={logout}
              >
                <LogoutOutlined />
                <span>{t("logout")}</span>
              </div>
            </>
          ) : (
            <Link
              href={ROUTER_PATH.SIGN_IN}
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-100 text-text-primary text-sm cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn size={18} />
              <span>{t("login")}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
