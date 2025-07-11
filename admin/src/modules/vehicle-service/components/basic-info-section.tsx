import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import { Card, Form, Input } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  serviceCategoryOptions: SelectOptionItem[];
  loadingServiceCategories: boolean;
};

const BasicInfoSection = ({
  mode,
  serviceCategoryOptions,
  loadingServiceCategories,
}: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Tên danh mục dịch vụ"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục dịch vụ" },
            ]}
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
            label="Danh mục"
            name="serviceCategory"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <SelectOption
              className="!h-10"
              placeholder="Chọn danh mục"
              options={serviceCategoryOptions}
              loading={loadingServiceCategories}
              disabled={isDisabled}
              allowClear
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
