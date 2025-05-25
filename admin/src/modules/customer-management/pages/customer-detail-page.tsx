"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { CustomerType } from "@/modules/customer-management/types/types";
import { mockDataTableManageCustomers } from "@/modules/customer-management/mocks/customer-data";
import CustomerVehicles from "@/modules/customer-management/components/customer-vehicle";
import { vehicleData } from "@/modules/customer-management/mocks/customer-vehicle";

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customerData, setCustomerData] = useState<CustomerType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const found = mockDataTableManageCustomers.find((item) => item.id === id);
    setCustomerData(found ?? null);
    setLoading(false);
  }, [id]);

  if (loading)
    return <div className="p-4 text-gray-600">Đang tải dữ liệu...</div>;
  if (!customerData)
    return <div className="p-4 text-red-600">Không tìm thấy khách hàng</div>;

  const statusIcon =
    customerData.status === "ACTIVE" ? (
      <CheckCircleOutlined className="text-green-500" />
    ) : customerData.status === "INACTIVE" ? (
      <PauseCircleOutlined className="text-yellow-500" />
    ) : (
      <StopOutlined className="text-gray-400" />
    );

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar size={120} icon={<UserOutlined />} src={customerData.photo} />
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {customerData.first_name} {customerData.last_name}
          </h2>
          <div className="flex items-center justify-center md:justify-start mt-1 gap-2">
            {statusIcon}
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

      <hr className="border-t border-gray-300 my-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
        <InfoItem icon={<MailOutlined />} label={customerData.email ?? ""} />
        <InfoItem
          icon={
            customerData.gender === "MALE" ? <ManOutlined /> : <WomanOutlined />
          }
          label={customerData.gender === "MALE" ? "Nam" : "Nữ"}
        />
        <InfoItem
          icon={<EnvironmentOutlined />}
          label={`${customerData.address}, ${customerData.ward}, ${customerData.district}, ${customerData.city}`}
        />
        <InfoItem icon={<PhoneOutlined />} label={customerData.phone ?? ""} />
        <InfoItem
          icon={<CalendarOutlined />}
          label={moment(customerData.dob).format("DD-MM-YYYY")}
        />
      </div>

      <CustomerVehicles
        customerId={customerData.id}
        vehicleData={vehicleData}
      />
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-500">{icon}</div>
    <span className="text-sm font-medium break-words">{label}</span>
  </div>
);

export default CustomerDetailPage;
