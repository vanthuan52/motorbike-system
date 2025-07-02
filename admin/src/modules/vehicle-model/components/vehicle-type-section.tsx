import { Form, Card, Select } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_VEHICLE_MODEL_TYPE } from "../types";

const { Option } = Select;

type VehicleTypeSectionProps = {
  mode: ENUM_PAGE_MODE;
  onTypeChange: (status: ENUM_VEHICLE_MODEL_TYPE) => void;
};

const VehicleTypeSection = ({
  mode,
  onTypeChange,
}: VehicleTypeSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const handleChange = (value: ENUM_VEHICLE_MODEL_TYPE) => {
    onTypeChange(value);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mt-4">Thể loại xe</h2>
      <div className="mt-2">
        <Form.Item name="type">
          <Select
            placeholder="Chọn thể loại"
            disabled={isDisabled}
            onChange={handleChange}
          >
            <Option value={ENUM_VEHICLE_MODEL_TYPE.UNKNOWN}>
              Không xác định
            </Option>
            <Option value={ENUM_VEHICLE_MODEL_TYPE.SCOOTER}>Xe ga</Option>
            <Option value={ENUM_VEHICLE_MODEL_TYPE.MANUAL}>Xe số</Option>
            <Option value={ENUM_VEHICLE_MODEL_TYPE.SLUTCH}>Xe côn tay</Option>
            <Option value={ENUM_VEHICLE_MODEL_TYPE.ELECTRIC}>Xe điện</Option>
          </Select>
        </Form.Item>
      </div>
    </Card>
  );
};

export default VehicleTypeSection;
