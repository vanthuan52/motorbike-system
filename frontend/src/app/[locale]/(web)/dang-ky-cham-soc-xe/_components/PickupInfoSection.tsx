import { Form, Input } from "antd";

export default function PickupInfoSection({}) {
  return (
    <Form.Item
      label={<span className="font-semibold text-base">Địa chỉ cụ thể</span>}
      name="address"
      rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
    >
      <Input placeholder="Nhập địa chỉ cụ thể" size="large" />
    </Form.Item>
  );
}
