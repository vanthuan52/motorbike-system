/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Vehicle } from "@/types/Vehicle";
import { VehicleType } from "@/types/VehicleType";

interface MyVehicleModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialData?: Vehicle | null;
  vehicleTypes: VehicleType[];
}

const MyVehicleModal = ({
  open,
  onCancel,
  onSubmit,
  initialData,
  vehicleTypes,
}: MyVehicleModalProps) => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
      });
      setImagePreview(initialData.image_file_name || null);
    } else {
      form.resetFields();
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        image_file_name: imagePreview,
      };
      onSubmit(formattedValues);
      form.resetFields();
      setImageFile(null);
      setImagePreview(null);
    });
  };

  return (
    <Modal
      title={initialData ? "Chỉnh sửa xe" : "Thêm xe mới"}
      open={open}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setImageFile(null);
        setImagePreview(null);
      }}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      width="90vw"
      style={{ maxWidth: 700, top: 20 }}
      destroyOnClose
      centered
    >
      <div className="flex flex-col md:flex-row p-6 gap-6">
        <div className="flex flex-col items-center justify-center flex-none w-full md:w-[180px]">
          <div className="w-full max-w-[180px] h-[180px] border-2 border-dashed border-gray-300 rounded-md mb-3 flex justify-center items-center overflow-hidden bg-gray-50 relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Ảnh xe"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <span className="text-gray-400 text-center">Chưa có ảnh</span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <Button
            icon={<UploadOutlined />}
            type="primary"
            className="w-full max-w-[180px] h-12 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600"
            onClick={() => fileInputRef.current?.click()}
          >
            Tải ảnh lên
          </Button>
        </div>

        <div className="flex-1">
          <Form layout="vertical" className="max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="license_plate"
                label="Biển số"
                rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
              >
                <Input placeholder="VD: 59A-12345" />
              </Form.Item>

              <Form.Item
                name="vehicle_type_id"
                label="Loại xe"
                rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
              >
                <Select placeholder="Chọn loại xe">
                  {vehicleTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="vehicle_model"
                label="Dòng xe"
                rules={[{ required: true, message: "Vui lòng nhập dòng xe" }]}
              >
                <Input placeholder="VD: SH Mode, Vision, v.v." />
              </Form.Item>

              <Form.Item
                name="color"
                label="Màu sắc"
                rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
              >
                <Input placeholder="VD: Đen, Đỏ, Trắng..." />
              </Form.Item>

              <Form.Item
                name="engine_number"
                label="Số máy"
                rules={[{ required: true, message: "Vui lòng nhập số máy" }]}
              >
                <Input placeholder="Nhập số máy của xe" />
              </Form.Item>

              <Form.Item
                name="chassis_number"
                label="Số khung"
                rules={[{ required: true, message: "Vui lòng nhập số khung" }]}
              >
                <Input placeholder="Nhập số khung của xe" />
              </Form.Item>

              <Form.Item name="note" label="Ghi chú" className="md:col-span-2">
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập ghi chú cho xe (nếu có)"
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default MyVehicleModal;
