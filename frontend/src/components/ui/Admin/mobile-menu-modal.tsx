"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { RxHome } from "react-icons/rx";
import { ROUTER_PATH } from "@/constant/router-path";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { GrSchedulePlay } from "react-icons/gr";
import { AiOutlineSchedule } from "react-icons/ai";
import { FiEdit2, FiUsers } from "react-icons/fi";
import { LiaUsersCogSolid } from "react-icons/lia";
import { TbSettingsCode } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { IoCarSportSharp } from "react-icons/io5";

type MobileMenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const links = [
  {
    label: "Trang chủ",
    icon: <RxHome size={24} />,
    href: ROUTER_PATH.ADMIN.INDEX,
  },
  {
    label: "Lịch hẹn",
    icon: <GrSchedulePlay size={24} />,
    href: ROUTER_PATH.ADMIN.APPOINTMENTS,
  },
  {
    label: "Bảo dưỡng",
    icon: <AiOutlineSchedule size={24} />,
    href: ROUTER_PATH.ADMIN.MAINTENANCE,
  },
  {
    label: "Hãng xe",
    icon: <IoCarSportSharp size={24} />,
    href: ROUTER_PATH.ADMIN.VEHICLE_BRAND,
  },
  {
    label: "Loại xe",
    icon: <BiCategoryAlt size={24} />,
    href: ROUTER_PATH.ADMIN.VEHICLE_TYPE,
  },
  {
    label: "Phụ tùng",
    icon: <TbSettingsCode size={24} />,
    href: ROUTER_PATH.ADMIN.VEHICLE_PART,
  },
  {
    label: "Nhân viên",
    icon: <LiaUsersCogSolid size={24} />,
    href: ROUTER_PATH.ADMIN.EMPLOYEES,
  },
  {
    label: "Khách hàng",
    icon: <FiUsers size={24} />,
    href: ROUTER_PATH.ADMIN.CUSTOMERS,
  },
  {
    label: "Tin nhắn",
    icon: <FiUsers size={24} />,
    href: ROUTER_PATH.ADMIN.MESSAGES,
  },
  {
    label: "Bài viết",
    icon: <FiEdit2 size={24} />,
    href: ROUTER_PATH.ADMIN.POSTS,
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
          {links.map((link, index) => (
            <div
              className=" bg-blue-200 rounded-md px-2 py-4 flex flex-1 items-center flex-col gap-2"
              key={index}
            >
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
