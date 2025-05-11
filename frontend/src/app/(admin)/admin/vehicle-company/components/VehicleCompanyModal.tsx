import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";

interface FormValues {
  name: string;
  description: string;
  status: boolean;
}

interface VehicleCompanyType {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initialData?: VehicleCompanyType | null;
  onCancel: () => void;
  onSubmit: (values: VehicleCompanyType) => void;
}

export default function VehicleCompanyModal({
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
      const values = await form.validateFields();
      const company: VehicleCompanyType = {
        id: initialData?.id ?? 0,
        name: values.name,
        description: values.description,
        status: values.status,
      };
      onSubmit(company);
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <Modal
      title={mode === "edit" ? "Chỉnh sửa hãng xe" : "Thêm hãng xe mới"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên hãng xe"
          rules={[{ required: true, message: "Nhập tên hãng xe" }]}
        >
          <Input placeholder="Nhập tên hãng xe" />
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
