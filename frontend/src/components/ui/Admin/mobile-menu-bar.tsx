"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RxHome } from "react-icons/rx";
import { RiListSettingsLine } from "react-icons/ri";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { ROUTER_PATH } from "@/constant/router-path";
import { BiMessageDetail } from "react-icons/bi";
import MobileMenuModal from "./mobile-menu-modal";

export default function MobileMenubar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    {
      href: ROUTER_PATH.ADMIN.INDEX,
      icon: <RxHome size={22} />,
      label: "Home",
    },
    {
      href: ROUTER_PATH.ADMIN.MAINTENANCE,
      icon: <RiListSettingsLine size={22} />,
      label: "Bảo dưỡng",
    },
    {
      href: ROUTER_PATH.ADMIN.MESSAGES,
      icon: <BiMessageDetail size={22} />,
      label: "Tin nhắn",
    },

    {
      icon: <Menu size={22} />,
      label: "Menu",
      onClick: () => setIsModalOpen(true),
    },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t border-gray-200 py-2 shadow-sm md:hidden">
        {menuItems.map((item, index) => {
          const isActive = item.href == pathname;

          const baseClass = clsx(
            "flex flex-col items-center text-sm",
            isActive ? "!text-blue-500 font-medium" : "text-black"
          );

          if (item.href) {
            return (
              <Link key={index} href={item.href} className={baseClass}>
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          }

          return (
            <div key={index} onClick={item.onClick} className={clsx(baseClass)}>
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </div>
          );
        })}
      </div>

      <MobileMenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
