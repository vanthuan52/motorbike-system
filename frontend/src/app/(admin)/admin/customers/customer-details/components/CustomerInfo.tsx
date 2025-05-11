"use client";
import React from "react";
import { Avatar } from "antd";
import { User, Mail, Mars, MapPin, Phone, Calendar, Dot } from "lucide-react";
import moment from "moment";
import { CustomerType } from "@/types/Customers";

interface Props {
  customerData: CustomerType;
}

const CustomerInfo: React.FC<Props> = ({ customerData }) => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar size={120} icon={<User />} src={customerData.photo} />
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {customerData.first_name} {customerData.last_name}
          </h2>
          <div className="flex items-center justify-center md:justify-start mt-1">
            <Dot size={20} color={customerData.status ? "green" : "gray"} />
            <span className="text-sm text-gray-700">
              {customerData.status === "ACTIVE"
                ? "Đang hoạt động"
                : customerData.status === "INACTIVE"
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
            {customerData.email}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Mars size={20} className="text-gray-500" />
          <span className="text-sm font-medium">
            {customerData.gender === "MALE" ? "Nam" : "Nữ"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-gray-500" />
          <span className="text-sm font-medium break-words">
            {customerData.address}, {customerData.ward}, {customerData.district}
            , {customerData.city}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={20} className="text-gray-500" />
          <span className="text-sm font-medium">{customerData.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-gray-500" />
          <span className="text-sm font-medium">
            {moment(customerData.dob).format("DD-MM-YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
