import { Form, Select, Card } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_USER_STATUS } from "@/modules/user/types";

const { Option } = Select;

type StatusSectionProps = {
  mode: ENUM_PAGE_MODE;
  onStatusChange: (status: ENUM_USER_STATUS) => void;
};

const StatusSection = ({ mode, onStatusChange }: StatusSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const handleChange = (value: ENUM_USER_STATUS) => {
    onStatusChange(value);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Trạng thái</h2>
      <Form.Item name="status">
        <Select
          placeholder="Chọn trạng thái"
          disabled={isDisabled}
          onChange={handleChange}
        >
          <Option value={ENUM_USER_STATUS.ACTIVE}>Hoạt động</Option>
          <Option value={ENUM_USER_STATUS.INACTIVE}>Không hoạt động</Option>
          <Option value={ENUM_USER_STATUS.BLOCKED}>Chặn</Option>
        </Select>
      </Form.Item>
      <p className="text-xs text-gray-500 mt-1">Chọn trạng thái.</p>
    </Card>
  );
};

export default StatusSection;
