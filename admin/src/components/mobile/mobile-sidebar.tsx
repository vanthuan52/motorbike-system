import React from "react";
import clsx from "clsx";
import { HiOutlineX } from "react-icons/hi";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-transparent bg-opacity-50 transition-opacity z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed top-0 left-0 w-full h-full bg-white shadow-md transform transition-transform z-50",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black focus:outline-none"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-3">
          <a href="#" className="block text-gray-700 hover:text-black">
            Trang chủ
          </a>
          <a href="#" className="block text-gray-700 hover:text-black">
            Thông báo
          </a>
          <a href="#" className="block text-gray-700 hover:text-black">
            Tài khoản
          </a>
        </nav>
      </aside>
    </>
  );
};

export default MobileSidebar;
