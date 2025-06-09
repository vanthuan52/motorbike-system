"use client";

import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
}

export default function UserAvatar({ name, avatarUrl }: UserAvatarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(!open);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
      >
        <img
          src={avatarUrl || "/images/avatar/default-avatar.jpeg"}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <FaChevronDown className="text-gray-500 text-xs" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            <CustomLink href="/admin/profiles">Hồ sơ cá nhân</CustomLink>
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            <CustomLink href="/admin/settings">Cài đặt</CustomLink>
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
