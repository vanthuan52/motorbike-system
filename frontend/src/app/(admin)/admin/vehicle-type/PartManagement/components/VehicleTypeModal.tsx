import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";

interface FormValues {
  company_id: number | null;
  name: string;
  description: string;
  status: boolean;
}

interface VehicleType {
  id: number;
  company_id: number;
  name: string;
  description: string;
  status: boolean;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initialData?: VehicleType | null;
  onCancel: () => void;
  onSubmit: (values: VehicleType) => void;
}

const companyOptions = [
  { label: "Kawasaki", value: 0 },
  { label: "Yamaha", value: 1 },
  { label: "Honda", value: 2 },
  { label: "Suzuki", value: 3 },
  { label: "SYM", value: 4 },
  { label: "Ducati", value: 5 },
];

export default function VehicleTypeModal({
  visible,
  mode,
  initialData,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        form.setFieldsValue({
          company_id: initialData.company_id,
          name: initialData.name,
          description: initialData.description,
          status: initialData.status,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: false });
      }
    }
  }, [visible, form, initialData, mode]);

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      const vehicle: VehicleType = {
        id: initialData?.id ?? 0,
        company_id: vals.company_id ?? 0,
        name: vals.name,
        description: vals.description,
        status: vals.status,
      };
      onSubmit(vehicle);
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <Modal
      title={mode === "edit" ? "Chỉnh sửa xe" : "Thêm xe mới"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="company_id"
          label="Hãng xe"
          rules={[{ required: true, message: "Chọn hãng xe" }]}
        >
          <Select placeholder="Chọn hãng xe">
            {companyOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên xe"
          rules={[{ required: true, message: "Nhập tên xe" }]}
        >
          <Input placeholder="Nhập tên xe" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Nhập mô tả" rows={3} />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" valuePropName="value">
          <Select>
            <Select.Option value={false}>Ngừng hoạt động</Select.Option>
            <Select.Option value={true}>Đang hoạt động</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
