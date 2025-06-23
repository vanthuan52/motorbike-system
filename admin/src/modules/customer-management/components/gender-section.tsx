import { Form, Select, Card } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

const { Option } = Select;

type GenderSectionProps = {
  mode: ENUM_PAGE_MODE;
};

const GenderSection = ({ mode }: GenderSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Giới tính</h2>
      <Form.Item name="gender">
        <Select placeholder="Chọn giới tính" disabled={isDisabled}>
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>
      <p className="text-xs text-gray-500 mt-1">Chọn giới tính.</p>
    </Card>
  );
};

export default GenderSection;
