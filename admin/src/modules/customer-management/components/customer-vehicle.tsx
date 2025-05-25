import React from "react";
import { Space } from "antd";
import Table from "@/components/ui/table/table";
import { ColumnsType } from "antd/es/table";
import { Vehicle } from "@/types/vehicle";
import { mockDataTableVehicleType } from "@/modules/vehicle-type/mocks/vehicle-type";

interface Props {
  customerId: string;
  vehicleData: Vehicle[];
}

const vehicleColumns: ColumnsType<Vehicle> = [
  {
    title: "STT",
    render: (_, __, index) => index + 1,
    width: 60,
  },
  {
    title: "Ảnh",
    dataIndex: "image_file_name",
    render: (url: string, record: Vehicle) => (
      <Space>
        <img
          src={url}
          alt={record.license_plate}
          className="w-12 h-8 object-cover rounded"
        />
      </Space>
    ),
  },
  { title: "Biển xe", dataIndex: "license_plate" },
  { title: "Đời xe", dataIndex: "vehicle_model" },
  { title: "Màu xe", dataIndex: "color" },
  { title: "Số máy", dataIndex: "engine_number" },
  { title: "Số khung", dataIndex: "chassis_number" },
  {
    title: "Loại xe",
    dataIndex: "vehicle_type_id",
    render: (id: string) => {
      const type = mockDataTableVehicleType.find((v) => v.id === id);
      return type?.name ?? "";
    },
  },
];

const CustomerVehicles: React.FC<Props> = ({ customerId, vehicleData }) => {
  const filtered = vehicleData.filter((v) => v.customer_id === customerId);
  return (
    <div className="mt-8 space-y-3">
      <h2 className="text-2xl font-semibold text-gray-800">
        Thông tin phương tiện
      </h2>
      <Table
        dataSource={filtered}
        columns={vehicleColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default CustomerVehicles;
