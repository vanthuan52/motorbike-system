import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import { Card, Form, Input } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  vehicleModelOptions: SelectOptionItem[];
  loadingVehicleModel: boolean;
  customerOptions: SelectOptionItem[];
  loadingCustomer: boolean;
};

const BasicInfoSection = ({
  mode,
  vehicleModelOptions,
  loadingVehicleModel,
  customerOptions,
  loadingCustomer,
}: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Người dùng"
            name="user"
            rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
          >
            <SelectOption
              className="!h-10"
              placeholder="Chọn danh mục"
              options={customerOptions}
              loading={loadingCustomer}
              disabled={isDisabled}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Loại xe"
            name="vehicleModel"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <SelectOption
              className="!h-10"
              placeholder="Chọn danh mục"
              options={vehicleModelOptions}
              loading={loadingVehicleModel}
              disabled={isDisabled}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Biển số xe" name="licensePlateNumber">
            <Input
              placeholder="Nhập biển số xe"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
