import { Form, Card, Select } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_VEHICLE_SERVICE_STATUS } from "../types";

const { Option } = Select;

type StatusSectionProps = {
  mode: ENUM_PAGE_MODE;
  onStatusChange: (status: ENUM_VEHICLE_SERVICE_STATUS) => void;
};

const StatusSection = ({ mode, onStatusChange }: StatusSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const handleChange = (value: ENUM_VEHICLE_SERVICE_STATUS) => {
    onStatusChange(value);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mt-4">Trạng thái</h2>
      <div className="mt-2">
        <Form.Item name="status">
          <Select
            placeholder="Chọn trạng thái"
            disabled={isDisabled}
            onChange={handleChange}
          >
            <Option value={ENUM_VEHICLE_SERVICE_STATUS.ACTIVE}>
              Hoạt động
            </Option>
            <Option value={ENUM_VEHICLE_SERVICE_STATUS.INACTIVE}>
              Không hoạt động
            </Option>
          </Select>
        </Form.Item>
      </div>
    </Card>
  );
};

export default StatusSection;
