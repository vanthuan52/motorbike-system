"use client";
import React, { useEffect, useState, useRef } from "react";
import { Menu, Phone, MapPin, Clock, X, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./styles.css";

interface ContactInfo {
  icon: LucideIcon;
  text: string;
}

interface NavItem {
  href: string;
  label: string;
}

interface ContactItemProps {
  Icon: LucideIcon;
  text: string;
}

interface NavLinkProps {
  href: string;
  label: string;
  mobile?: boolean;
  className?: string;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeDrawer();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const contactInfo: ContactInfo[] = [
    { icon: Phone, text: "0123 456 789" },
    { icon: MapPin, text: "123 Đường ABC, Quận 1, TP.HCM" },
    { icon: Clock, text: "Thứ 2 – CN: 8:00 – 18:00" },
  ];

  const navItems: NavItem[] = [
    { href: "/solutions", label: "Giải pháp" },
    { href: "/services", label: "Dịch vụ" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Liên hệ" },
  ];

  const ContactItem: React.FC<ContactItemProps> = ({ Icon, text }) => (
    <div className="flex items-center gap-2">
      <Icon size={16} />
      <span>{text}</span>
    </div>
  );

  const NavLink: React.FC<NavLinkProps> = ({
    href,
    label,
    mobile = false,
    className = "",
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`
          ${mobile ? "text-gray-700 hover:text-green-600" : "text-gray-800"}
          ${isActive ? "text-green-600" : ""}
          ${className}
        `}
        onClick={mobile ? closeDrawer : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50">
      {/* Top Bar */}
      <div className="text-gray-800 text-[15px] px-2 py-2 border-b border-gray-200 bg-gray-100">
        <div className="hidden md:flex justify-end items-center gap-8">
          {contactInfo.map(({ icon: Icon, text }, index) => (
            <ContactItem key={index} Icon={Icon} text={text} />
          ))}
        </div>
        <div className="md:hidden overflow-hidden">
          <div className="inline-flex gap-12 whitespace-nowrap animate-marquee hover:pause">
            {contactInfo.map(({ icon: Icon, text }, index) => (
              <ContactItem key={`first-${index}`} Icon={Icon} text={text} />
            ))}
            {contactInfo.map(({ icon: Icon, text }, index) => (
              <ContactItem key={`dup-${index}`} Icon={Icon} text={text} />
            ))}
          </div>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <Link href="/" className="text-xl font-bold">
          Mortorbike
        </Link>

        <nav className="hidden md:flex gap-6 text-gray-800 font-medium">
          {navItems.map(({ href, label }) => (
            <NavLink key={label} href={href} label={label} />
          ))}
        </nav>

        <Link
          href="/dang-ky-bao-duong-xe"
          className="hidden md:block bg-black text-white font-semibold px-5 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Đặt lịch
        </Link>

        {/* Hamburger Icon */}
        <button className="md:hidden" onClick={toggleDrawer}>
          <Menu size={24} />
        </button>
      </div>

      {/* Custom Drawer (Mobile Menu) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity">
          <div
            ref={drawerRef}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 flex-1">
              {navItems.map(({ href, label }) => (
                <NavLink
                  key={label}
                  href={href}
                  label={label}
                  mobile
                  className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 hover:text-green-600 transition-colors active:bg-gray-200"
                />
              ))}
            </nav>
            <Link
              href="/dang-ky-bao-duong-xe"
              className="mt-6 bg-green-600 text-white text-center py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={closeDrawer}
            >
              Đặt lịch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
