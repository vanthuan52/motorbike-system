/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import { Skeleton } from "antd";
import { mockDataTableVehicleType } from "@/data/TableData";
import { VehicleType } from "@/types/VehicleType";
import { ModalReuse } from "@/components/ui/Modal/ModalReuse";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import TableReuse from "@/components/ui/Table/Table";
import { GreenSwitch } from "@/components/ui/Switch";
import { ActionButtonsReuse } from "@/components/ui/Button/ActionButtonsReuse";
import { ModalDeleteReuse } from "@/components/ui/Modal/ModalDeleteReuse";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import { validateFieldVehicleType } from "@/utils/validation/PartManagement";
import VehicleTypeForm from "./VehicleTypeForm";
export default function VehicleTypes() {
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof mockDataTableVehicleType)[0] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(mockDataTableVehicleType);
  const [formData, setFormData] = useState<VehicleType>({
    id: 0,
    company_id: null,
    name: "",
    description: "",
    status: true,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof VehicleType, string>>
  >({
    name: "",
    description: "",
    company_id: "",
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
    setFormData({
      id: 0,
      company_id: null,
      name: "",
      description: "",
      status: true,
    });
    setOpen(true);
  };

  const handleOpenEdit = (record: (typeof mockDataTableVehicleType)[0]) => {
    setIsEditMode(true);
    setFormData(record);
    setOpen(true);
  };
  const resetForm = () => {
    setFormData({
      id: 0,
      company_id: 0,
      name: "",
      description: "",
      status: true,
    });
    setErrors({});
  };
  const handleChange = (field: keyof VehicleType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (isSubmitted || errors[field]) {
      const error = validateFieldVehicleType(field, value);
      setErrors((prev) => ({ ...prev, [field]: error || "" }));
    }
  };
  const handleSubmit = () => {
    setIsSubmitted(true);

    const newErrors: Partial<Record<keyof VehicleType, string>> = {};

    (Object.keys(formData) as (keyof typeof formData)[]).forEach((field) => {
      const error = validateFieldVehicleType(field, formData[field]);
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
      toast.success("Cập nhật loại xe thành công!");
    } else {
      const newId = Math.max(...dataSource.map((d) => Number(d.id))) + 1;
      const newRecord = { ...formData, id: newId };
      setDataSource((prev: any) => [...prev, newRecord]);
      toast.success("Thêm loại xe thành công!");
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
    toast.success("Xóa loại xe thành công!");
    setDeleteModalOpen(false);
  };
  const columns: ColumnsType<(typeof mockDataTableVehicleType)[0]> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hãng xe",
      dataIndex: "company_id",
      key: "company_id",
      render: (value) => {
        const company = mockDataTableVehicleType.find(
          (item) => item.company_id === value
        );
        return company ? company.company_id : "N/A";
      },
    },
    {
      title: "Tên loại xe",
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
        title="Loại xe"
        onClickAdd={handleOpenCreate}
        addButtonLabel="Thêm loại xe"
      />
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <SearchInputReuse
            onChange={(text) =>
              setDataSource(
                mockDataTableVehicleType.filter((item) =>
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
          title={isEditMode ? "Chỉnh sửa loại xe" : "Thêm loại xe mới"}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleSubmit}
        >
          <VehicleTypeForm
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
