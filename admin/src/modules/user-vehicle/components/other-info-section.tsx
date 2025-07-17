import { Card, Form, Input } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
type OtherInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
};
const OtherInfoSection = ({ mode }: OtherInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin khác</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item label="Màu sắc" name="color">
            <Input
              placeholder="Nhập màu sắc"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item label="Số máy" name="engineNumber">
            <Input
              placeholder="Nhập số máy"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item label="Số khung" name="chassisNumber">
            <Input
              placeholder="Nhập Số khung"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default OtherInfoSection;
