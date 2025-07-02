import { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { VehicleType } from "../types";
import { mockDataTableVehicleCompany } from "@/modules/vehicle-brand/mocks/vehicle-company";

interface FormValues {
  company_id: string | null;
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

const companyOptions = mockDataTableVehicleCompany.map((item) => ({
  value: item.id,
  label: item.name,
}));
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
        id: initialData?.id ?? "",
        company_id: vals.company_id ?? null,
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
      destroyOnHidden
      okText={mode === "edit" ? "Lưu" : "Thêm"}
      cancelText="Hủy"
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
