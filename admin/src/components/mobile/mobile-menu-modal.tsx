"use client";

import { useEffect, useState } from "react";
import { RxHome } from "react-icons/rx";
import { GrSchedulePlay } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { FiEdit2, FiUsers } from "react-icons/fi";
import { LiaFileInvoiceSolid, LiaUsersCogSolid } from "react-icons/lia";
import { TbSettingsCode } from "react-icons/tb";
import { BiCategoryAlt, BiX } from "react-icons/bi";
import { ROUTER_PATH } from "@/constants/router-path";
import { FaMotorcycle } from "react-icons/fa";

type MobileMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const links = [
  {
    label: "Trang chủ",
    icon: <RxHome size={24} />,
    href: ROUTER_PATH.INDEX,
  },
  {
    label: "Lịch hẹn",
    icon: <GrSchedulePlay size={24} />,
    href: ROUTER_PATH.MAINTENANCE_SCHEDULE,
  },
  {
    label: "Bảo dưỡng",
    icon: <AiOutlineSchedule size={24} />,
    href: ROUTER_PATH.MAINTENANCE,
  },
  {
    label: "Hãng xe",
    icon: <FaMotorcycle size={24} />,
    href: ROUTER_PATH.VEHICLE_COMPANY,
  },
  {
    label: "Loại xe",
    icon: <BiCategoryAlt size={24} />,
    href: ROUTER_PATH.VEHICLE_TYPE,
  },
  {
    label: "Phụ tùng",
    icon: <TbSettingsCode size={24} />,
    href: ROUTER_PATH.VEHICLE_PART,
  },
  {
    label: "Nhân viên",
    icon: <LiaUsersCogSolid size={24} />,
    href: ROUTER_PATH.EMPLOYEES,
  },
  {
    label: "Khách hàng",
    icon: <FiUsers size={24} />,
    href: ROUTER_PATH.CUSTOMERS,
  },
  {
    label: "Tin nhắn",
    icon: <FiUsers size={24} />,
    href: ROUTER_PATH.MESSAGES,
  },
  {
    label: "Bài viết",
    icon: <FiEdit2 size={24} />,
    href: ROUTER_PATH.POSTS,
  },
  {
    key: "invoices",
    icon: <LiaFileInvoiceSolid size={24} />,
    href: ROUTER_PATH.INVOICES,
    label: "Quản lý hóa đơn",
  },
  {
    key: "roles-permissions",
    icon: <FiUsers size={24} />,
    href: ROUTER_PATH.ROLES,
    label: "Vai trò",
  },
  {
    key: "roles-permissions",
    icon: <TbSettingsCode size={24} />,
    href: ROUTER_PATH.PERMISSIONS,
    label: "Quyền",
  },
  {
    key: "products",
    icon: <FaMotorcycle size={24} />,
    href: ROUTER_PATH.PRODUCTS,
    label: "Sản phẩm",
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
            <BiX size={28} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-10">
          {links.map((link, index) => (
            <div
              className=" bg-blue-200 rounded-md px-2 py-4 flex flex-1 items-center flex-col gap-2"
              key={index}
            >
              {link.icon}
              <a
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className=""
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
