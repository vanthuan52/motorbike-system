import React from "react";
import { HiOutlineMenu, HiOutlineBell } from "react-icons/hi";

interface MobileHeaderProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  title?: string;
}

const HeaderNav: React.FC<MobileHeaderProps> = ({
  onMenuClick,
  onNotificationClick,
  title = "Dashboard",
}) => {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <button
        onClick={onMenuClick}
        className="text-gray-700 hover:text-black focus:outline-none transition-colors"
        aria-label="Open menu"
      >
        <HiOutlineMenu className="w-6 h-6" />
      </button>

      {/* <h1 className="text-lg font-semibold text-gray-800">{title}</h1> */}

      <button
        onClick={onNotificationClick}
        className="relative text-gray-700 hover:text-black focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <HiOutlineBell className="w-6 h-6" />
        <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </header>
  );
};

export default HeaderNav;
