"use client";

import { HiOutlineChevronDown, HiOutlineChevronRight } from "react-icons/hi";
import clsx from "clsx";
import { Tooltip } from "antd";
import { useEffect } from "react";
import { SidebarMenuItem } from "@/types/application";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { usePathname } from "next/navigation";
interface Props {
  item: SidebarMenuItem;
  collapsed: boolean;
  isOpen: boolean;
  toggleOpen: (key: string) => void;
  setSidebarCollapsed: (value: boolean) => void;
}

export default function SidebarItem({
  item,
  collapsed,
  isOpen,
  toggleOpen,
  setSidebarCollapsed,
}: Props) {
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;

  const isActive = item.href == pathname;
  useEffect(() => {
    if (pathname === "/admin/messages") {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [pathname, setSidebarCollapsed]);
  return (
    <div>
      <div
        className={clsx(
          "flex items-center justify-between p-2 rounded-md cursor-pointer transition-all",
          isActive ? "bg-gray-200" : "hover:bg-gray-100"
        )}
        onClick={() => hasChildren && toggleOpen(item.key)}
      >
        <Tooltip title={item.label} placement="right">
          <CustomLink className="flex items-center gap-3" href={item.href}>
            <span className="text-xl font-medium">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </CustomLink>
        </Tooltip>
        {!collapsed && hasChildren && (
          <span className="text-xs">
            {isOpen ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
          </span>
        )}
      </div>
    </div>
  );
}
