"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import type { ColumnsType } from "antd/es/table";
import { Vehicle } from "@/types/Vehicle";
import MyVehicleModal from "./MyVehicleModal";
import { mockVehicleTypes } from "@/data/MyVehicle";
import TableReuse from "@/components/ui/Table/Table";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import { IMG_PLACEHOLDER } from "@/constant/application";
import Skeleton from "../../../../components/ui/SkeletonTable";
import SkeletonTable from "../../../../components/ui/SkeletonTable";
import { mockVehicles } from "@/data/MyVehicle";

const MyVehicle = () => {
  const [vehicleData, setVehicleData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setVehicleData(mockVehicles);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [mockVehicles]);

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
        <div
          style={{ width: 64, height: 48, position: "relative" }}
          className="rounded-md overflow-hidden"
        >
          <Image
            src={url || IMG_PLACEHOLDER}
            alt="Vehicle"
            width={64}
            height={48}
            className="object-contain w-full h-full"
            priority
          />
        </div>
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

  const filteredVehicles = vehicleData.filter(
    (vehicle) =>
      vehicle.license_plate?.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.vehicle_model?.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.vehicle_type_id
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      vehicle.engine_number?.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.chassis_number
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      vehicle.color?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="container">
        <div className=" flex justify-between items-center mb-4">
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
          <div className="mb-4">
            <SearchInputReuse onChange={(text) => setSearchText(text)} />
          </div>

          {loading ? (
            <SkeletonTable
              columns={[
                { title: "Ảnh xe" },
                { title: "Biển số" },
                { title: "Loại xe" },
                { title: "Dòng xe" },
                { title: "Số máy" },
                { title: "Số khung" },
                { title: "Màu sắc" },
                { title: "Hành động" },
              ]}
              rows={5}
            />
          ) : (
            <TableReuse
              dataSource={filteredVehicles}
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
    </div>
  );
};

export default MyVehicle;
