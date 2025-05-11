"use client";
import React from "react";
import { Avatar } from "antd";
import { User, Mail, Mars, MapPin, Phone, Calendar, Dot } from "lucide-react";
import moment from "moment";
import { EmployeeType } from "@/types/Employees";

interface Props {
  employeeData: EmployeeType;
}

const EmployeeInfo: React.FC<Props> = ({ employeeData }) => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar size={120} icon={<User />} src={employeeData.photo} />
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {employeeData.first_name} {employeeData.last_name}
          </h2>
          <div className="flex items-center justify-center md:justify-start mt-1">
            <Dot size={20} color={employeeData.status ? "green" : "gray"} />
            <span className="text-sm text-gray-700">
              {employeeData.status === "ACTIVE"
                ? "Đang hoạt động"
                : employeeData.status === "INACTIVE"
                ? "Không hoạt động"
                : "Đã bị khóa"}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-gray-500" />
          <span className="text-sm font-medium break-all">
            {employeeData.email}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Mars size={20} className="text-gray-500" />
          <span className="text-sm font-medium">
            {employeeData.gender === "MALE" ? "Nam" : "Nữ"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-gray-500" />
          <span className="text-sm font-medium break-words">
            {employeeData.address}, {employeeData.ward}, {employeeData.district}
            , {employeeData.city}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={20} className="text-gray-500" />
          <span className="text-sm font-medium">{employeeData.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-gray-500" />
          <span className="text-sm font-medium">
            {moment(employeeData.dob).format("DD-MM-YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
