import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import { Card, Form, Input } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  vehicleServiceOptions: SelectOptionItem[];
  loadingVehicleServiceOptions: boolean;
  vehicleModelOptions: SelectOptionItem[];
  loadingVehicleModelOptions: boolean;
};

const BasicInfoSection = ({
  mode,
  vehicleServiceOptions,
  vehicleModelOptions,
  loadingVehicleServiceOptions,
  loadingVehicleModelOptions,
}: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Giá dịch vụ"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá tiền" }]}
          >
            <Input
              type="number"
              placeholder="Nhập giá..."
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Dịch vụ"
            name="vehicleService"
            rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
          >
            <SelectOption
              className="!h-10 w-40 xs:w-50"
              placeholder="Chọn dịch vụ"
              options={vehicleServiceOptions}
              loading={loadingVehicleServiceOptions}
              disabled={isDisabled}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Dòng xe"
            name="vehicleModel"
            rules={[{ required: true, message: "Vui lòng chọn dòng xe" }]}
          >
            <SelectOption
              className="!h-10 w-40 xs:w-50"
              placeholder="Chọn dòng xe"
              options={vehicleModelOptions}
              loading={loadingVehicleModelOptions}
              disabled={isDisabled}
              allowClear
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
