"use client";

import { Calendar, MapPin, Mail, Phone, User } from "lucide-react";

interface UserInfoProps {
  email: string;
  phone: string;
  dob: string;
  gender: "MALE" | "FEMALE" | null;
  ward: string;
  district: string;
  city: string;
}

export default function UserInfo({
  email,
  phone,
  dob,
  gender,
  ward,
  district,
  city,
}: UserInfoProps) {
  const genderText =
    gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : "Khác";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="mt-6 flex flex-col lg:flex-row items-start justify-between gap-8 max-w-4xl mx-auto">
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={18} /> <span>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} /> <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} /> <span>{formatDate(dob)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={18} /> <span>{genderText}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>{`${ward}, ${district}, ${city}`}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full lg:w-auto">
        <button className="bg-violet-600 text-white rounded-md px-5 py-2 hover:bg-violet-700 transition text-sm">
          Đặt lịch bảo dưỡng
        </button>
        <button className="border border-violet-600 text-violet-600 rounded-md px-5 py-2 hover:bg-violet-100 transition text-sm">
          Liên hệ kỹ thuật
        </button>
      </div>
    </div>
  );
}
