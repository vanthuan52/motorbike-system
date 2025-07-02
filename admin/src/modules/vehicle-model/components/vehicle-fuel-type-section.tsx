import { Form, Card, Select } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_VEHICLE_MODEL_FUEL_TYPE } from "../types";

const { Option } = Select;

type VehicleFuelTypeSectionProps = {
  mode: ENUM_PAGE_MODE;
  onFuelTypeChange: (status: ENUM_VEHICLE_MODEL_FUEL_TYPE) => void;
};

const VehicleFuelTypeSection = ({
  mode,
  onFuelTypeChange,
}: VehicleFuelTypeSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const handleChange = (value: ENUM_VEHICLE_MODEL_FUEL_TYPE) => {
    onFuelTypeChange(value);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mt-4">Nhiên liệu sử dụng</h2>
      <div className="mt-2">
        <Form.Item name="fuelType">
          <Select
            placeholder="Chọn nhiên liệu"
            disabled={isDisabled}
            onChange={handleChange}
          >
            <Option value={ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN}>
              Không xác định
            </Option>
            <Option value={ENUM_VEHICLE_MODEL_FUEL_TYPE.GASOLINE}>Xăng</Option>
            <Option value={ENUM_VEHICLE_MODEL_FUEL_TYPE.HYBRID}>
              Xăng và điện
            </Option>
            <Option value={ENUM_VEHICLE_MODEL_FUEL_TYPE.ELECTRIC}>Điện</Option>
          </Select>
        </Form.Item>
      </div>
    </Card>
  );
};

export default VehicleFuelTypeSection;
