/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Home, IdCard } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Briefcase, Calendar, Shield, User } from "lucide-react";
import { mockDataTableManageEmployees } from "@/data/TableData";
import Breadcrumb from "@/components/ui/Admin/Breadcrumb";
import EmployeeInfo from "./components/EmployeeInfo";
import moment from "moment";
export default function EmployeeDetails() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("id");

  const employeeData = mockDataTableManageEmployees.find(
    (employee) => employee.id === employeeId
  );
  if (!employeeData) {
    return (
      <div className="text-center text-red-500">
        Không tìm thấy dữ liệu nhân viên
      </div>
    );
  }
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/admin",
      icon: <Home className="text-xs" />,
    },
    {
      label: "Quản lý người dùng",
      href: "/admin/users-management/customers",
    },
    {
      label: "Nhân viên",
    },
    {
      label: `${employeeData.first_name} ${employeeData.last_name}`,
    },
  ];
  return (
    <div className="p-4 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <EmployeeInfo employeeData={employeeData} />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Thông tin công việc</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          <InfoItem
            icon={<IdCard size={20} />}
            label="Mã nhân viên"
            value={employeeData.employee_code}
          />
          <InfoItem
            icon={<Calendar size={20} />}
            label="Ngày bắt đầu làm việc"
            value={moment(employeeData.start_date).format("DD-MM-YYYY")}
          />
          <InfoItem
            icon={<Briefcase size={20} />}
            label="Vị trí"
            value={employeeData.position}
          />
          <InfoItem
            icon={<User size={20} />}
            label="Loại tài khoản"
            value={employeeData.type}
          />
          <InfoItem
            icon={<Shield size={20} />}
            label="Vai trò hệ thống"
            value={employeeData.role}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1">{icon}</div>
      <p className="text-base text-gray-700">
        <span className="font-medium">{label}</span> : {value}
      </p>
    </div>
  );
}
