import { ReactNode, useEffect, useState } from "react";
import SidebarItem from "./sidebar-item";
import { useLocation } from "react-router-dom";

export type SidebarMenuItem = {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  children?: SidebarMenuItem[];
};

interface Props {
  items: SidebarMenuItem[];
  collapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}

const OPEN_MENUS_KEY = "sidebarOpenMenus";

export default function SidebarMenu({
  items,
  collapsed,
  setSidebarCollapsed,
}: Props) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const stored = localStorage.getItem(OPEN_MENUS_KEY);
    let initialOpenMenus: string[] = [];
    if (stored) {
      initialOpenMenus = JSON.parse(stored);
    }

    items.forEach((item) => {
      if (
        item.children &&
        item.children.some((child) => child.href === pathname)
      ) {
        if (!initialOpenMenus.includes(item.key)) {
          initialOpenMenus.push(item.key);
        }
      }
    });

    setOpenMenus(initialOpenMenus);
  }, [pathname, items]);

  useEffect(() => {
    localStorage.setItem(OPEN_MENUS_KEY, JSON.stringify(openMenus));
  }, [openMenus]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <nav className="flex flex-col gap-1 p-2">
      {items.map((item) => (
        <SidebarItem
          key={item.key}
          item={item}
          collapsed={collapsed}
          isOpen={openMenus.includes(item.key)}
          toggleOpen={toggleMenu}
          setSidebarCollapsed={setSidebarCollapsed}
        />
      ))}
    </nav>
  );
}
