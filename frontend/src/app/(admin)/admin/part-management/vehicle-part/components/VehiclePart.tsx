/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import { Skeleton } from "antd";
import { mockDataTableVehiclePart } from "@/data/TableData";
import { VehiclePart } from "@/types/VehiclePart";
import { ModalReuse } from "@/components/ui/Modal/ModalReuse";
import { PageHeaderReuse } from "@/components/ui/Admin/PageHeaderReuse";
import TableReuse from "@/components/ui/Table/Table";
import { GreenSwitch } from "@/components/ui/Switch";
import { ActionButtonsReuse } from "@/components/ui/Button/ActionButtonsReuse";
import { ModalDeleteReuse } from "@/components/ui/Modal/ModalDeleteReuse";
import { SearchInputReuse } from "@/components/ui/SearchInputReuse";
import VehiclePartForm from "./VehiclePartForm";
import { validateFieldVehiclePart } from "@/utils/validation/PartManagement";
import { getBase64 } from "@/utils/fileUtils";
export default function VehicleParts() {
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof mockDataTableVehiclePart)[0] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(mockDataTableVehiclePart);
  const [formData, setFormData] = useState({
    id: 0,
    vehicle_type_id: null,
    name: "",
    code: "",
    average_life: null,
    unit_price: null,
    quantity: null,
    status: true,
    image: null,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof VehiclePart, string>>
  >({
    name: "",
    vehicle_type_id: "",
    average_life: "",
    unit_price: "",
    quantity: "",
    image: "",
    status: "",
  });

  const [fileList, setFileList] = useState<any[]>([]);
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
      vehicle_type_id: null,
      name: "",
      code: "",
      average_life: null,
      unit_price: null,
      quantity: null,
      status: true,
      image: null,
    });
    setOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setIsEditMode(true);
    setFormData(record);
    setOpen(true);
  };
  const resetForm = () => {
    setFormData({
      id: 0,
      vehicle_type_id: null,
      name: "",
      code: "",
      average_life: null,
      unit_price: null,
      quantity: null,
      status: true,
      image: null,
    });
    setErrors({});
  };
  // hàm handleChange cho các trường trong form
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (isSubmitted || errors[field]) {
      const error = validateFieldVehiclePart(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }));
    }
  };
  // hàm submit vehicle part
  const handleSubmit = () => {
    setIsSubmitted(true);

    const newErrors: Partial<Record<keyof VehiclePart, string>> = {};

    (Object.keys(formData) as (keyof typeof formData)[]).forEach((field) => {
      const error = validateFieldVehiclePart(field, formData[field]);
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
      toast.success("Cập nhật phụ tùng thành công!");
    } else {
      const newId = Math.max(0, ...dataSource.map((d) => Number(d.id))) + 1;
      const newRecord = { ...formData, id: newId };
      setDataSource((prev: any) => [...prev, newRecord]);
      toast.success("Thêm phụ tùng thành công!");
    }
    resetForm();
    setOpen(false);
    setIsSubmitted(false);
  };
  const handleUploadChange = async (info: any) => {
    const newList = info.fileList.slice(-1);
    if (newList[0]?.originFileObj) {
      try {
        const preview = await getBase64(newList[0].originFileObj);
        newList[0] = {
          ...newList[0],
          preview,
          url: preview,
        };
        setFormData((prev: any) => ({ ...prev, image: preview }));
      } catch (e) {
        console.error(e);
      }
    }
    setFileList(newList);
  };

  const handlePreview = (file: any) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setFileList([
        {
          ...file,
          preview: fileReader.result,
        },
      ]);
    };
    fileReader.readAsDataURL(file.originFileObj);
  };
  const handleRemovePreview = (file: any) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    setFormData((prev) => ({ ...prev, image: null }));
  };
  const handleOpenDelete = (record: any) => {
    setSelectedItem(record);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setDataSource((prev) =>
      prev.filter((item) => item.id !== selectedItem?.id)
    );
    toast.success("Xóa phụ tùng thành công!");
    setDeleteModalOpen(false);
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
        title="Phụ tùng"
        onClickAdd={handleOpenCreate}
        addButtonLabel="Thêm phụ tùng"
      />
      <div className="bg-white rounded-lg shadow-md p-4">
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

        {/* Modal Create / Edit */}
        <ModalReuse
          title={isEditMode ? "Chỉnh sửa phụ tùng" : "Thêm phụ tùng mới"}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleSubmit}
        >
          <VehiclePartForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleUploadChange={handleUploadChange}
            handlePreview={handlePreview}
            fileList={fileList}
            handleRemovePreview={handleRemovePreview}
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
