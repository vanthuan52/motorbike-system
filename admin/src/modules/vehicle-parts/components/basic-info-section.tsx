import { Card, Form, Input } from "antd";
import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import { ENUM_PAGE_MODE } from "@/types/app.type";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  partTypeOptions: SelectOptionItem[];
  vehicleBrandOptions: SelectOptionItem[];
  loadingPartTypeOptions: boolean;
  loadingVehicleBrandOptions: boolean;
};

const BasicInfoSection = ({
  mode,
  partTypeOptions,
  vehicleBrandOptions,
  loadingPartTypeOptions,
  loadingVehicleBrandOptions,
}: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <Form.Item
          label="Tên phụ tùng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phụ tùng" }]}
        >
          <Input placeholder="Nhập tên phụ tùng" disabled={isDisabled} />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug" }]}
        >
          <Input placeholder="Nhập slug" disabled={isDisabled} />
        </Form.Item>

        <Form.Item
          label="Loại phụ tùng"
          name="partType"
          rules={[{ required: true, message: "Vui lòng chọn loại phụ tùng" }]}
        >
          <SelectOption
            placeholder="Chọn loại phụ tùng"
            options={partTypeOptions}
            loading={loadingPartTypeOptions}
            disabled={isDisabled}
            allowClear
            className="!h-10 w-full"
          />
        </Form.Item>

        <Form.Item
          label="Hãng xe"
          name="vehicleBrand"
          rules={[{ required: true, message: "Vui lòng chọn hãng xe" }]}
        >
          <SelectOption
            placeholder="Chọn hãng xe"
            options={vehicleBrandOptions}
            loading={loadingVehicleBrandOptions}
            disabled={isDisabled}
            allowClear
            className="!h-10 w-full"
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea
            placeholder="Nhập mô tả"
            rows={3}
            disabled={isDisabled}
          />
        </Form.Item>

        <Form.Item label="Thứ tự" name="order">
          <Input
            type="number"
            placeholder="Thứ tự hiển thị"
            disabled={isDisabled}
          />
        </Form.Item>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
