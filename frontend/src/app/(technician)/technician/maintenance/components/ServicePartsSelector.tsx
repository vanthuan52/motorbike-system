import { Form, Select, Button } from "antd";
import { useState } from "react";

const servicesOptions = [
  { value: "oil_change", label: "Thay dầu nhớt" },
  { value: "brake_check", label: "Kiểm tra phanh" },
  { value: "spark_plug", label: "Thay bugi" },
  { value: "tire_check", label: "Kiểm tra lốp" },
];
const partsOptions = [
  { value: "oil", label: "Dầu nhớt" },
  { value: "brake_pad", label: "Bố thắng" },
  { value: "spark_plug", label: "Bugi" },
  { value: "tire", label: "Lốp xe" },
];

interface Props {
  initialServices: string[];
  initialParts: string[];
  onSave: (services: string[], parts: string[]) => void;
}

export default function ServicePartsSelector({
  initialServices,
  initialParts,
  onSave,
}: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: { services: string[]; parts: string[] }) => {
    setLoading(true);
    onSave(values.services, values.parts);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        services: initialServices,
        parts: initialParts,
      }}
      onFinish={handleFinish}
    >
      <Form.Item label="Dịch vụ bảo dưỡng" name="services">
        <Select
          mode="multiple"
          allowClear
          options={servicesOptions}
          placeholder="Chọn các dịch vụ bảo dưỡng"
        />
      </Form.Item>
      <Form.Item label="Phụ tùng thay thế" name="parts">
        <Select
          mode="multiple"
          allowClear
          options={partsOptions}
          placeholder="Chọn các phụ tùng cần thay"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu hạng mục
      </Button>
    </Form>
  );
}
