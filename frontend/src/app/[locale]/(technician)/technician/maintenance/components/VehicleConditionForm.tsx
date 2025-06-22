import { Form, Input, Button } from "antd";
import { useState } from "react";

interface Props {
  initialValue: string;
  onSave: (condition: string) => void;
}

export default function VehicleConditionForm({ initialValue, onSave }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: { condition: string }) => {
    setLoading(true);
    onSave(values.condition);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ condition: initialValue }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Đánh giá tình trạng xe trước bảo dưỡng"
        name="condition"
        rules={[{ required: true, message: "Vui lòng nhập tình trạng xe" }]}
      >
        <Input.TextArea
          rows={3}
          placeholder="Nhập chi tiết tình trạng xe, các lỗi phát hiện..."
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu đánh giá
      </Button>
    </Form>
  );
}
