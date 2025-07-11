import { Card, Form, Input, Select } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import SERVICE_CHECKLIST_AREA_OPTIONS from "../constants/area";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
};

const BasicInfoSection = ({ mode }: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Tên công việc"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
          >
            <Input
              placeholder="Nhập tên..."
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Code"
            name="code"
            rules={[
              { required: true, message: "Mã công việc không được để trống" },
            ]}
          >
            <Input placeholder="Code" size="large" disabled={isDisabled} />
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
          <Form.Item
            label="Khu vực"
            name="area"
            rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}
          >
            <Select
              className="!h-10"
              options={SERVICE_CHECKLIST_AREA_OPTIONS}
              placeholder="Chọn khu vực"
              disabled={isDisabled}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
