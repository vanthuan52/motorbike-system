/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import { Button, Popconfirm, Skeleton, Tooltip } from "antd";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { mockDataTableMaintenance } from "@/data/TableData";
import { MaintenanceManagementTypes } from "@/types/MaintenanceManagementTypes";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import TableReuse from "@/components/ui/Table/Table";
import { formatVND } from "@/helpers/formatVND";
import { PageHeading } from "@/components/ui/Admin/page-heading";
import MaintenanceModal from "./MaintenanceModal";
export default function Maintenance() {
  const [dataSource, setDataSource] = useState<MaintenanceManagementTypes[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [assignVisible, setAssignVisible] = useState(false);
  const [selected, setSelected] = useState<MaintenanceManagementTypes | null>(
    null
  );
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(
        mockDataTableMaintenance.map((item) => ({
          ...item,
          id: String(item.id),
          phone: Number(item.phone),
        }))
      );
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const openCreate = () => {
    setIsEdit(false);
    setSelected(null);
    setAssignVisible(true);
  };

  const openEdit = (record: MaintenanceManagementTypes) => {
    setIsEdit(true);
    setSelected(record);
    setAssignVisible(true);
  };

  const handleDelete = (id: string) => {
    setDataSource((prev) => prev.filter((item) => item.id !== id));
    toast.success("Xóa đơn bảo dưỡng thành công");
  };

  const handleAssignSubmit = (values: any) => {
    if (isEdit && selected) {
      setDataSource((prev) =>
        prev.map((item) => (item.id === selected.id ? values : item))
      );
      toast.success("Cập nhật đơn bảo dưỡng thành công");
    } else {
      const newId = Math.max(...dataSource.map((d) => Number(d.id)), 0) + 1;
      setDataSource((prev) => [...prev, { ...values, id: newId }]);
      toast.success("Tạo đơn bảo dưỡng mới thành công");
    }
    setAssignVisible(false);
  };

  const columns: ColumnsType<MaintenanceManagementTypes> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer: string) => customer,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
      render: (staff: any) => staff?.name,
    },
    {
      title: "Ngày bảo dưỡng",
      dataIndex: "maintenance_date",
      key: "maintenance_date",
      render: (maintenance_date: string) =>
        moment(maintenance_date).format("DD-MM-YYYY"),
    },
    {
      title: "Tổng chi phí",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (total_cost: number) => `${formatVND(total_cost)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => s,
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
    <div className="">
      {/* <PageHeading title="Quản lý đơn bảo dưỡng" /> */}
      <PageHeaderReuse
        title="Quản lý đơn bảo dưỡng"
        onClickAdd={openCreate}
        addButtonLabel="Tạo đơn bảo dưỡng"
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockDataTableMaintenance
                  .filter((item) =>
                    item.customer.toLowerCase().includes(text.toLowerCase())
                  )
                  .map((item) => ({
                    ...item,
                    id: String(item.id),
                    phone: Number(item.phone),
                  }))
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

        <MaintenanceModal
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
