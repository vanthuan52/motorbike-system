"use client";

import { useEffect, useState } from "react";
import { Home, X } from "lucide-react";
import { ROUTER_PATH } from "@/constant/router-path";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";

type MobileMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const links = [
  {
    label: "Trang chủ",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.INDEX,
  },
  {
    label: "Lịch hẹn",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.APPOINTMENTS,
  },
  {
    label: "Bảo dưỡng",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.MAINTENANCE,
  },
  {
    label: "Hãng xe",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.VEHICLE_BRAND,
  },
  {
    label: "Loại xe",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.VEHICLE_TYPE,
  },
  {
    label: "Phụ tùng",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.VEHICLE_PART,
  },
  {
    label: "Nhân viên",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.EMPLOYEES,
  },
  {
    label: "Khách hàng",
    icon: <Home size={24} />,
    href: ROUTER_PATH.ADMIN.CUSTOMERS,
  },
];

export default function MobileMenuModal({
  isOpen,
  onClose,
}: MobileMenuModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 md:hidden">
      <div
        className={`relative z-10 w-full h-screen bg-white rounded-t-2xl p-4 overflow-y-auto transform transition-transform duration-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chức năng</h2>
          <button onClick={handleClose}>
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-10">
          {links.map((link) => (
            <div className=" bg-blue-200 rounded-md px-2 py-4 flex flex-1 items-center flex-col gap-2">
              {link.icon}
              <CustomLink
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className=""
              >
                {link.label}
              </CustomLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
