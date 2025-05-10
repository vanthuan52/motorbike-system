"use client";

import { HiOutlineChevronDown, HiOutlineChevronRight } from "react-icons/hi";
import clsx from "clsx";
import { SidebarMenuItem } from "@/types/application";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { usePathname } from "next/navigation";

interface Props {
  item: SidebarMenuItem;
  collapsed: boolean;
  isOpen: boolean;
  toggleOpen: (key: string) => void;
}

export default function SidebarItem({
  item,
  collapsed,
  isOpen,
  toggleOpen,
}: Props) {
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;

  const isActive = item.href == pathname;

  return (
    <div>
      <div
        className={clsx(
          "flex items-center justify-between p-2 rounded-md cursor-pointer transition-all",
          isActive ? "bg-gray-200" : "hover:bg-gray-100"
        )}
        onClick={() => hasChildren && toggleOpen(item.key)}
      >
        <CustomLink className="flex items-center gap-3" href={item.href}>
          <span className="text-xl font-medium">{item.icon}</span>
          {!collapsed && (
            <span className="text-sm font-medium">{item.label}</span>
          )}
        </CustomLink>

        {!collapsed && hasChildren && (
          <span className="text-xs">
            {isOpen ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
          </span>
        )}
      </div>
    </div>
  );
}
