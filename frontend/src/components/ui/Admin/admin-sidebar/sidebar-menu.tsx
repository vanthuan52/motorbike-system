"use client";

import { SidebarMenuItem } from "@/types/application";
import SidebarItem from "./sidebar-item";
import { useState } from "react";

interface Props {
  items: SidebarMenuItem[];
  collapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}

export default function SidebarMenu({
  items,
  collapsed,
  setSidebarCollapsed,
}: Props) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

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
