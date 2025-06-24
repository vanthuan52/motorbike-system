import { GreenSwitch } from "@/components/ui/switch";
import { mockDataTableVehicleCompany } from "@/modules/vehicle-company/mocks/vehicle-company";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { Card, Form, Input, Select } from "antd";
import { ENUM_PART_TYPE_STATUS } from "../types";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  onStatusChange: (status: ENUM_PART_TYPE_STATUS) => void;
};

const BasicInfoSection = ({ mode, onStatusChange }: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const handleChange = (checked: boolean) => {
    const status = checked
      ? ENUM_PART_TYPE_STATUS.ACTIVE
      : ENUM_PART_TYPE_STATUS.INACTIVE;
    onStatusChange(status);
  };
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input
              placeholder="Nhập tên sản phẩm"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Slug không được để trống" }]}
          >
            <Input
              placeholder="Slug"
              size="large"
              disabled={isDisabled}
              readOnly
            />
          </Form.Item>
          <Form.Item
            label="Hãng xe"
            name="vehicle_company_id"
            rules={[{ required: true, message: "Vui lòng chọn hãng xe" }]}
          >
            <Select
              placeholder="Chọn hãng xe"
              size="large"
              disabled={isDisabled}
            >
              {mockDataTableVehicleCompany.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            valuePropName="checked"
          >
            <GreenSwitch onChange={handleChange} disabled={isDisabled} />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
