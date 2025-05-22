"use client";

import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Skeleton, Tooltip } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { Vehicle } from "@/types/Vehicle";
import MyVehicleModal from "./MyVehicleModal";
import { mockVehicleTypes } from "@/data/MyVehicle";
import TableReuse from "@/components/ui/Table/Table";
import type { ColumnsType } from "antd/es/table";

interface MyVehicleProps {
  vehicles: Vehicle[];
}

const MyVehicle = ({ vehicles }: MyVehicleProps) => {
  const [vehicleData, setVehicleData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVehicleData(vehicles);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [vehicles]);

  const getVehicleTypeName = (id: string) =>
    mockVehicleTypes.find((vt) => vt.id === id)?.name || "Không xác định";

  const handleAdd = () => {
    setEditingVehicle(null);
    setOpenModal(true);
  };

  const handleEdit = (record: Vehicle) => {
    setEditingVehicle(record);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    setVehicleData((prev) => prev.filter((v) => v.id !== id));
    toast.success("Đã xóa xe thành công");
  };

  const handleSubmit = (values: any) => {
    if (editingVehicle) {
      setVehicleData((prev) =>
        prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...values } : v))
      );
      toast.success("Cập nhật xe thành công");
    } else {
      const newVehicle: Vehicle = {
        id: `veh-${Date.now()}`,
        customer_id: "user-001",
        ...values,
      };
      setVehicleData((prev) => [...prev, newVehicle]);
      toast.success("Thêm xe mới thành công");
    }
    setOpenModal(false);
  };

  const columns: ColumnsType<Vehicle> = [
    {
      title: "Ảnh xe",
      dataIndex: "image_file_name",
      render: (url: string) => (
        <img
          src={url}
          alt="vehicle"
          className="w-16 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Biển số",
      dataIndex: "license_plate",
    },
    {
      title: "Loại xe",
      dataIndex: "vehicle_type_id",
      render: (id: string) => getVehicleTypeName(id),
    },
    {
      title: "Dòng xe",
      dataIndex: "vehicle_model",
    },
    {
      title: "Số máy",
      dataIndex: "engine_number",
    },
    {
      title: "Số khung",
      dataIndex: "chassis_number",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: Vehicle) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa xe?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Xe của tôi</h2>
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          onClick={handleAdd}
        >
          Thêm xe
        </Button>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {loading ? (
          <div className="space-y-4 w-full">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <Skeleton.Avatar active size={64} shape="square" />
                <Skeleton.Input active style={{ width: 120, height: 32 }} />
                <Skeleton.Input active style={{ width: 150, height: 32 }} />
                <Skeleton.Input active style={{ width: 120, height: 32 }} />
                <Skeleton.Input active style={{ width: 120, height: 32 }} />
                <Skeleton.Input active style={{ width: 100, height: 32 }} />
                <Skeleton.Input active style={{ width: 80, height: 32 }} />
                <Skeleton.Input active style={{ width: 140, height: 32 }} />
              </div>
            ))}
          </div>
        ) : (
          <TableReuse
            dataSource={vehicleData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="rounded-md"
          />
        )}

        <MyVehicleModal
          open={openModal}
          onCancel={() => setOpenModal(false)}
          onSubmit={handleSubmit}
          initialData={editingVehicle}
          vehicleTypes={mockVehicleTypes}
        />
      </div>
    </div>
  );
};

export default MyVehicle;
