/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Space } from "antd";
import TableReuse from "@/components/ui/Table/Table";
import { Home } from "lucide-react";
import Breadcrumb from "@/components/ui/Admin/Breadcrumb";
import CustomerInfo from "./components/CustomerInfo";
import { mockDataTableManageCustomers, vehicleData } from "@/data/TableData";

const vehicleColumns = [
  {
    title: "STT",
    dataIndex: "key",
    key: "key",
    width: 60,
  },
  {
    title: "Ảnh",
    dataIndex: "image",
    key: "image",
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
    dataIndex: "plate",
    key: "plate",
  },
  {
    title: "Hãng xe",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "Dòng xe",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "Màu xe",
    dataIndex: "color",
    key: "color",
  },
  {
    title: "Số máy",
    dataIndex: "engineNo",
    key: "engineNo",
  },
  {
    title: "Số khung",
    dataIndex: "chassisNo",
    key: "chassisNo",
  },
  {
    title: "Loại xe",
    dataIndex: "type",
    key: "type",
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
