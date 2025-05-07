"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User2, Search, X } from "lucide-react";
import "./styles.css";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { APP_INFO } from "@/constant/application";
import { ROUTER_PATH } from "@/constant/router-path";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NAV_ITEMS = [
  { href: ROUTER_PATH.SERVICES, label: "Dịch vụ" },
  { href: ROUTER_PATH.ABOUT, label: "Giới thiệu" },
  { href: ROUTER_PATH.BLOG, label: "Blog" },
  { href: ROUTER_PATH.CONTACT, label: "Liên hệ" },
];

function NavLink({ href, label, isActive, onClick }: NavLinkProps) {
  return (
    <CustomLink
      href={href}
      onClick={onClick}
      className={`nav-link block py-2 md:py-0 relative ${
        isActive ? "!text-red-400" : ""
      }`}
    >
      {label}
    </CustomLink>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-2xs">
      {/* Top bar */}
      <div className="w-full bg-black text-white text-sm">
        <div className="container flex items-center justify-between py-2">
          <Link href={`tel:${APP_INFO.HOTLINE}`}>
            Hotline: {APP_INFO.HOTLINE}
          </Link>
          <div className="flex items-center gap-4">
            <CustomLink href="#">
              <User2 size={24} />
            </CustomLink>
            <CustomLink href="#">
              <Search size={24} />
            </CustomLink>
            <div>VN</div>
          </div>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="container flex items-center justify-between py-2">
        <CustomLink href="/" className="text-xl font-bold">
          Logo name.
        </CustomLink>

        <nav className="hidden md:flex gap-6 font-medium">
          {NAV_ITEMS.map(({ href, label }) => (
            <NavLink
              key={label}
              href={href}
              label={label}
              isActive={pathname === href}
            />
          ))}
        </nav>

        <div className="flex gap-4">
          <CustomLink href={ROUTER_PATH.MAINTAIN_REGISTRATION}>
            <button className="bg-black text-white font-medium px-5 py-2 rounded-md cursor-pointer">
              Đặt lịch
            </button>
          </CustomLink>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 space-y-4 mt-7">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">
              <X size={28} />
            </button>
          </div>
          {NAV_ITEMS.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              isActive={pathname === href}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
