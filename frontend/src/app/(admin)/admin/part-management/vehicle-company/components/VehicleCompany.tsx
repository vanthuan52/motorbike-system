/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import { Skeleton } from "antd";
import { ModalReuse } from "@/components/ui/Modal/ModalReuse";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import TableReuse from "@/components/ui/Table/Table";
import { mockDataTable } from "@/data/TableData";
import { ActionButtonsReuse } from "@/components/ui/Button/ActionButtonsReuse";
import { GreenSwitch } from "@/components/ui/Switch";
import { VehicleCompanyTypes } from "@/types/VehicleCompany";
import { ModalDeleteReuse } from "@/components/ui/Modal/ModalDeleteReuse";
import { validateFieldVehicleCompany } from "@/utils/validation/PartManagement";
import { VehicleCompanyForm } from "./VehicleCompanyForm";

export default function VehicleCompany() {
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof mockDataTable)[0] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(mockDataTable);
  const [formData, setFormData] = useState<VehicleCompanyTypes>({
    id: 0,
    name: "",
    description: "",
    status: true,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof VehicleCompanyTypes, string>>
  >({
    name: "",
    description: "",
    status: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  // fake loading
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({ id: 0, name: "", description: "", status: true });
    setOpen(true);
  };

  const handleOpenEdit = (record: (typeof mockDataTable)[0]) => {
    setIsEditMode(true);
    setFormData(record);
    setOpen(true);
  };
  const resetForm = () => {
    setFormData({ id: 0, name: "", description: "", status: true });
    setErrors({});
  };
  // hàm handleChange cho các trường trong form
  const handleChange = (field: keyof VehicleCompanyTypes, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (isSubmitted || errors[field]) {
      const error = validateFieldVehicleCompany(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }));
    }
  };
  // hàm submit vehicle company
  const handleSubmit = () => {
    setIsSubmitted(true);

    const newErrors: Partial<Record<keyof VehicleCompanyTypes, string>> = {};

    (Object.keys(errors) as (keyof VehicleCompanyTypes)[]).forEach((field) => {
      const error = validateFieldVehicleCompany(field, formData[field]);
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
      setDataSource((prev) =>
        prev.map((item) => (item.id === formData.id ? formData : item))
      );
      toast.success("Cập nhật hãng xe thành công!");
    } else {
      const newId = Math.max(...dataSource.map((d) => Number(d.id))) + 1;
      const newRecord = { ...formData, id: newId };
      setDataSource((prev) => [...prev, newRecord]);
      toast.success("Thêm hãng xe thành công!");
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
    toast.success("Xóa hãng xe thành công!");
    setDeleteModalOpen(false);
  };
  const columns: ColumnsType<(typeof mockDataTable)[0]> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên hãng xe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
        title="Hãng xe"
        onClickAdd={handleOpenCreate}
        addButtonLabel="Thêm hãng xe"
      />
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="mb-4">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockDataTable.filter((item) =>
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

        {/* Modal Create / Edit */}
        <ModalReuse
          title={isEditMode ? "Chỉnh sửa hãng xe" : "Thêm hãng xe mới"}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleSubmit}
        >
          <VehicleCompanyForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
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
