"use client";

import { usePathname } from "next/navigation";
import { mockUser } from "@/data/UserProfile";
import clsx from "clsx";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import SidebarContent from "./SidebarContent";


export default function UserSidebar({ open, setOpen }: { open?: boolean; setOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const user = mockUser;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <aside
        className={clsx(
          "lg:flex fixed top-0 left-6 bg-white rounded-br-xl shadow p-6 flex-col w-85 z-50 sm:z-0 transform transition-transform duration-300 hidden h-screen",
          "lg:translate-x-0 lg:static overflow-y-auto"
        )}
      >
        <SidebarContent
          pathname={pathname}
          user={user}
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
        />
      </aside>

      <aside
        className={clsx(
          "fixed top-0 left-0 bg-white shadow-lg flex flex-col w-72 z-[101] h-full transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ maxWidth: 320 }}
      >
        <button
          className="absolute top-4 right-4 z-10 bg-gray-100 rounded-full p-2"
          onClick={() => setOpen?.(false)}
          aria-label="Đóng menu"
        >
          <FaTimes className="text-lg text-gray-700" />
        </button>
        <div className="pt-8">
          <SidebarContent
            pathname={pathname}
            user={user}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
          />
        </div>
      </aside>
    </>
  );
}