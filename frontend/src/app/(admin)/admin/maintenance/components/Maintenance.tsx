/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import { Skeleton } from "antd";
import moment from "moment";
import { mockDataTableMaintenance } from "@/data/TableData";
import { validateFieldMaintenanceManagement } from "@/utils/validation/MaintenanceManagement";
import { MaintenanceManagementTypes } from "@/types/MaintenanceManagementTypes";
import { GreenSwitch } from "@/components/ui/Switch";
import { ActionButtonsReuse } from "@/components/ui/Button/ActionButtonsReuse";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import TableReuse from "@/components/ui/Table/Table";
import { ModalDeleteReuse } from "@/components/ui/Modal/ModalDeleteReuse";
import { ModalReuse } from "@/components/ui/Modal/ModalReuse";
import { formatVND } from "@/helpers/formatVND";
import MaintenanceForm from "./MaintenanceForm";
export default function Maintenance() {
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof mockDataTableMaintenance)[0] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(mockDataTableMaintenance);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<{
    id: number;
    customer: string;
    phone: string;
    staff: { id: number; name: string; phone: string; email: string } | null;
    maintenance_date: string;
    total_cost: number | null;
    status: string;
  }>({
    id: 0,
    customer: "",
    phone: "",
    staff: null,
    maintenance_date: "",
    total_cost: null,
    status: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({
    customer: "",
    phone: "",
    staff: "",
    maintenance_date: "",
    total_cost: "",
    status: "",
  });
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({
      id: 0,
      customer: "",
      phone: "",
      staff: null,
      maintenance_date: "",
      total_cost: null,
      status: "",
    });
    setOpen(true);
  };
  const handleOpenEdit = (item: (typeof mockDataTableMaintenance)[0]) => {
    setIsEditMode(true);
    setFormData(item);
    setOpen(true);
  };
  const resetForm = () => {
    setFormData({
      id: 0,
      customer: "",
      phone: "",
      staff: null,
      maintenance_date: "",
      total_cost: null,
      status: "",
    });
    setErrors({});
  };
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (isSubmitted || errors[field]) {
      const error = validateFieldMaintenanceManagement(field, value);
      setErrors((prev) => ({ ...prev, [field]: error || "" }));
    }
  };
  const handleDateChange = (date: Date | null) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";

    setFormData((prev) => ({ ...prev, maintenance_date: formattedDate }));

    const fieldError = validateFieldMaintenanceManagement(
      "maintenance_date",
      formattedDate
    );

    setErrors((prev) => ({ ...prev, maintenance_date: fieldError || "" }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    const newErrors: Partial<Record<keyof MaintenanceManagementTypes, string>> =
      {};

    (Object.keys(formData) as (keyof typeof formData)[]).forEach((field) => {
      const error = validateFieldMaintenanceManagement(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err);
    if (hasErrors) {
      toast.error("Vui lòng kiểm tra lại các trường!");
      return;
    }

    if (isEditMode) {
      setDataSource((prev: any) =>
        prev.map((item: any) => (item.id === formData.id ? formData : item))
      );
      toast.success("Cập thông tin bảo dưỡng thành công!");
    } else {
      const newId = Math.max(0, ...dataSource.map((d) => Number(d.id))) + 1;
      const newRecord = { ...formData, id: newId };
      setDataSource((prev: any) => [...prev, newRecord]);
      toast.success("Tạo đơn bảo dưỡng thành công!");
    }
    resetForm();
    setOpen(false);
    setIsSubmitted(false);
  };
  const handleOpenDelete = (record: any) => {
    setSelectedItem(record);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setDataSource((prev) =>
      prev.filter((item) => item.id !== selectedItem?.id)
    );
    toast.success("Xóa đơn bảo dưỡng thành công!");
    setDeleteModalOpen(false);
  };
  const columns: ColumnsType<(typeof mockDataTableMaintenance)[0]> = [
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
        <ActionButtonsReuse
          onView={() => handleOpenEdit(record)}
          onDelete={() => handleOpenDelete(record)}
        />
      ),
    },
  ];
  return (
    <div>
      <PageHeaderReuse
        title="Quản lý đơn bảo dưỡng"
        onClickAdd={handleOpenCreate}
        addButtonLabel="Tạo đơn bảo dưỡng"
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockDataTableMaintenance.filter((item) =>
                  item.customer.toLowerCase().includes(text.toLowerCase())
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

        {/* Modal Create / Edit */}
        <ModalReuse
          title={
            isEditMode
              ? "Chỉnh sửa thông tin đơn bảo dưỡng"
              : "Tạo đơn bảo dưỡng"
          }
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleSubmit}
        >
          <MaintenanceForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
          />
        </ModalReuse>

        <ModalDeleteReuse
          open={deleteModalOpen}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
