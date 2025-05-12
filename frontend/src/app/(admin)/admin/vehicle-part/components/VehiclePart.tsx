/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import { Button, Popconfirm, Skeleton, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { mockDataTableVehiclePart } from "@/data/TableData";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import TableReuse from "@/components/ui/Table/Table";
import { GreenSwitch } from "@/components/ui/Switch";

import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import VehiclePartModal from "./VehiclePartForm";
export default function VehicleParts() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [selected, setSelected] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(false);
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
  const handleDelete = (id: number) => {
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
      <PageHeaderReuse
        title="Phụ tùng"
        onClickAdd={openCreate}
        addButtonLabel="Thêm phụ tùng"
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <SearchInputReuse
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
          <div className="space-y-4 w-full">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex gap-4">
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
                <Skeleton.Input active style={{ width: 300, height: 32 }} />
              </div>
            ))}
          </div>
        ) : (
          <TableReuse
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
        />
      </div>
    </div>
  );
}
