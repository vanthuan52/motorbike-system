/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Space } from "antd";
import TableReuse from "@/components/ui/Table/Table";
import { Home } from "lucide-react";
import Breadcrumb from "@/components/ui/Admin/Breadcrumb";
import CustomerInfo from "./components/CustomerInfo";
import { ColumnsType } from "antd/es/table";
import {
  mockDataTableManageCustomers,
  mockDataTableVehicleType,
  vehicleData,
} from "@/data/TableData";
import { Vehicle } from "@/types/Vehicle";

const vehicleColumns: ColumnsType<Vehicle> = [
  {
    title: "STT",
    dataIndex: "key",
    key: "key",
    width: 60,
    render: (_, __, index) => index + 1,
  },
  {
    title: "Ảnh",
    dataIndex: "image_file_name",
    key: "image_file_name",
    render: (url: string, record: any) => (
      <Space>
        <img
          src={url}
          alt={record.plate}
          className="w-12 h-8 object-cover rounded"
        />
      </Space>
    ),
  },
  {
    title: "Biển xe",
    dataIndex: "license_plate",
    key: "license_plate",
  },
  {
    title: "Đời xe",
    dataIndex: "vehicle_model",
    key: "vehicle_model",
  },
  {
    title: "Màu xe",
    dataIndex: "color",
    key: "color",
  },
  {
    title: "Số máy",
    dataIndex: "engine_number",
    key: "engine_number",
  },
  {
    title: "Số khung",
    dataIndex: "chassis_number",
    key: "chassis_number",
  },
  {
    title: "Loại xe",
    dataIndex: "vehicle_type_id",
    key: "vehicle_type_id",
    render: (id: string) => {
      const vehicleType = mockDataTableVehicleType.find(
        (vehicleType) => vehicleType.id === id
      );
      return vehicleType ? vehicleType.name : "";
    },
  },
];

export default function CustomerDetails() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("id");

  const customerData = mockDataTableManageCustomers.find(
    (customer) => customer.id === customerId
  );

  if (!customerData) {
    return (
      <div className="text-center text-red-500">
        Không tìm thấy dữ liệu khách hàng
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
      label: "Khách hàng",
    },
    {
      label: `${customerData.first_name} ${customerData.last_name}`,
    },
  ];
  return (
    <div className="p-4 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <CustomerInfo customerData={customerData} />

      <div className="flex flex-col gap-3 mt-8">
        <h2 className="text-2xl font-semibold">Thông tin phương tiện</h2>
        <TableReuse
          dataSource={vehicleData}
          columns={vehicleColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}
