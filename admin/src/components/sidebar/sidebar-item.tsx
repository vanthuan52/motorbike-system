import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineChevronDown, HiOutlineChevronRight } from "react-icons/hi";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import { SidebarMenuItem } from "./sidebar-menu";

export type TableKeyValue = {
  label: string;
  value: string;
};

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
  const location = useLocation();
  const pathname = location.pathname;
  const hasChildren = !!item.children?.length;

  const isActive = item.href == pathname;
  useEffect(() => {
    if (pathname === "/messages") {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [pathname, setSidebarCollapsed]);
  return (
    <>
      <div
        className={clsx(
          "flex items-center justify-between p-2 rounded-md cursor-pointer transition-all",
          isActive ? "bg-gray-200" : "hover:bg-gray-100"
        )}
        onClick={() => hasChildren && toggleOpen(item.key)}
      >
        <Link
          className="flex items-center gap-3"
          to={item.href || ""}
          data-tooltip-id={item.href}
          data-tooltip-content={item.label}
        >
          <span className="text-xl font-medium">{item.icon}</span>
          {!collapsed && (
            <span className="text-sm font-medium">{item.label}</span>
          )}
        </Link>
        <Tooltip
          id={item.href}
          style={{
            zIndex: 3000,
          }}
        />
        {!collapsed && hasChildren && (
          <span className="text-xs">
            {isOpen ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
          </span>
        )}
      </div>
      {hasChildren && isOpen && !collapsed && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children!.map((child) => (
            <Link
              key={child.key}
              to={child.href || ""}
              className={clsx(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm",
                child.href === pathname && "bg-gray-200 font-semibold"
              )}
              data-tooltip-id={child.href}
              data-tooltip-content={child.label}
            >
              {child.icon && <span className="text-lg">{child.icon}</span>}
              {child.label}
              <Tooltip id={child.href} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
