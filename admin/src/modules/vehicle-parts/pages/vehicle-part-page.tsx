"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Skeleton, Tooltip } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { PageHeading } from "@/components/page-heading";
import Table from "@/components/ui/table/table";
import { GreenSwitch } from "@/components/ui/switch";
import { SearchInput } from "@/components/ui/search-input";

import VehiclePartModal from "@/modules/vehicle-parts/components/vehicle-part-modal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function VehiclePartsPage() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [selected, setSelected] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(mockDataTableVehiclePart);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const openCreate = () => {
    setIsEdit(false);
    setSelected(undefined);
    setAssignVisible(true);
  };

  const openEdit = (record: any) => {
    setIsEdit(true);
    setSelected(record);
    setFileList(record.image);
    setAssignVisible(true);
  };
  const handleAssignSubmit = (values: any) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      toast.success("Cập nhật phụ tùng thành công");
    } else {
      const newId = Math.max(...dataSource.map((d) => d.id), 0) + 1;
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      toast.success("Tạo phụ tùng mới thành công");
    }
    setAssignVisible(false);
  };
  const handleDelete = (id: string) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    toast.success("Xóa phụ tùng thành công");
  };
  const columns: ColumnsType<(typeof mockDataTableVehiclePart)[0]> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hãng xe",
      dataIndex: "vehicle_type_id",
      key: "vehicle_type_id",
      render: (value) => {
        const company = mockDataTableVehiclePart.find(
          (item) => item.vehicle_type_id === value
        );
        return company ? company.vehicle_type_id : "N/A";
      },
    },
    {
      title: "Tên phụ tùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: any) => (
        <GreenSwitch
          checked={status}
          onChange={() => {
            setDataSource((prev: any) =>
              prev.map((item: any) =>
                item.id === record.id ? { ...item, status: !item.status } : item
              )
            );
          }}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Tooltip title="Sửa" className="mr-1">
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="sm:px-4">
      <PageHeading
        title="Phụ tùng"
        onClickAdd={openCreate}
        addButtonLabel="Thêm phụ tùng"
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <SearchInput
            onChange={(text) =>
              setDataSource(
                mockDataTableVehiclePart.filter((item) =>
                  item.name.toLowerCase().includes(text.toLowerCase())
                )
              )
            }
          />
        </div>

        {loading ? (
          <SkeletonTable
            columns={[
              { title: "STT", width: 50, height: 20 },
              { title: "Mã hãng xe", width: 100, height: 20 },
              { title: "Tên phụ tùng", width: 100, height: 20 },
              { title: "Trạng thái", width: 100, height: 20 },
              { title: "Hành động", width: 100, height: 20 },
            ]}
            rows={5}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}

        <VehiclePartModal
          visible={assignVisible}
          mode={isEdit ? "edit" : "create"}
          initialData={selected}
          onCancel={() => setAssignVisible(false)}
          onSubmit={handleAssignSubmit}
          setFileList={setFileList}
          fileList={fileList}
        />
      </div>
    </div>
  );
}
