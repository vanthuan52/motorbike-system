"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import type { MaintenanceSchedule } from "../types/types";

const { Option } = Select;

interface EditScheduleModalProps {
  open: boolean;
  initialData: MaintenanceSchedule | null;
  onCancel: () => void;
  onSubmit: (updated: MaintenanceSchedule) => void;
}

export default function EditScheduleModal({
  open,
  initialData,
  onCancel,
  onSubmit,
}: EditScheduleModalProps) {
  const [form] = Form.useForm<MaintenanceSchedule>();

  // Khi initialData thay đổi (mở modal cho một item mới), set giá trị cho form
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      // Kết hợp với id và các trường khác từ initialData
      const updatedItem: MaintenanceSchedule = {
        ...(initialData as MaintenanceSchedule),
        ...values,
      };
      onSubmit(updatedItem);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      title="Chỉnh sửa lịch hẹn"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={handleOk}
      destroyOnClose
      width="90vw"
      style={{ maxWidth: 700, top: 20 }}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="first_name"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ" }]}
          >
            <Input placeholder="Nhập họ" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item name="phone_number" label="SĐT"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item name="email" label="Email" 
            rules={[{ required: true, message: "Vui lòng nhập email" }]}>
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="service_type"
            label="Dịch vụ"
            rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
          >
            <Select placeholder="Chọn dịch vụ">
              <Option value="Bảo dưỡng">Bảo dưỡng</Option>
              <Option value="Thay dầu">Thay dầu</Option>
              <Option value="Sửa chữa">Sửa chữa</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="time"
            label="Giờ hẹn"
            rules={[{ required: true, message: "Vui lòng nhập giờ hẹn" }]}
          >
            <Input placeholder="VD: 09:30 AM" />
          </Form.Item>

          <Form.Item name="vehicle_type" label="Loại xe"
            rules={[{ required: true, message: "Vui lòng nhập loại xe" }]}>
            <Input placeholder="Nhập loại xe" />
          </Form.Item>

          <Form.Item name="vehicle_brand" label="Hãng xe"
            rules={[{ required: true, message: "Vui lòng nhập hãng xe" }]}>
            <Input placeholder="Nhập hãng xe" />
          </Form.Item>

          <Form.Item name="vehicle_number" label="Biển số"
           rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
          >
            <Input placeholder="Nhập biển số" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú" className="md:col-span-2">
            <Input.TextArea rows={3} placeholder="Ghi chú (nếu có)" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
