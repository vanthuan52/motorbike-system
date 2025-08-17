import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import { Card, Form, Input } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  vehicleBrandOptions: SelectOptionItem[];
  loadingVehicleBrands: boolean;
};

const BasicInfoSection = ({
  mode,
  vehicleBrandOptions,
  loadingVehicleBrands,
}: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Tên dòng xe"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dòng xe" }]}
          >
            <Input
              placeholder="Nhập tên..."
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Tên đầy đủ"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ" }]}
          >
            <Input
              placeholder="Nhập tên..."
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Slug không được để trống" }]}
          >
            <Input placeholder="Slug" size="large" disabled={isDisabled} />
          </Form.Item>
          <Form.Item
            label="Hãng xe"
            name="vehicleBrand"
            rules={[{ required: true, message: "Vui lòng chọn hãng xe" }]}
          >
            <SelectOption
              className="!h-10 w-40 xs:w-50"
              placeholder="Chọn hãng xe"
              options={vehicleBrandOptions}
              loading={loadingVehicleBrands}
              disabled={isDisabled}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Đời xe"
            name="modelYear"
            rules={[{ required: true, message: "Đời xe" }]}
          >
            <Input
              placeholder="Nhập đời xe"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Dung tích xi-lanh"
            name="engineDisplacement"
            rules={[{ required: true, message: "Dung tích xi-lanh" }]}
          >
            <Input
              placeholder="Nhập dung tích"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Thứ tự"
            name="order"
            rules={[{ required: false, message: "Thứ tự hiển thị" }]}
          >
            <Input
              placeholder="Số bắt đầu từ 0"
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
