import { Card, Form, Input, Select } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_HIRING_STATUS } from "../types";

type OtherInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  handleStatusChange: (status: ENUM_HIRING_STATUS) => void;
};
const OtherInfoSection = ({
  mode,
  handleStatusChange,
}: OtherInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;
  const STATUS_HIRING_OPTIONS = [
    { label: "Nháp", value: ENUM_HIRING_STATUS.DRAFT },
    { label: "Đã đăng", value: ENUM_HIRING_STATUS.PUBLISHED },
    { label: "Đã lưu trữ", value: ENUM_HIRING_STATUS.ARCHIVED },
  ];
  const handleChange = (value: ENUM_HIRING_STATUS) => {
    handleStatusChange(value);
  };
  return (
    <div>
      <Card>
        <h2 className="text-lg font-semibold mb-4">Thông tin khác</h2>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                size="large"
                onChange={handleChange}
                disabled={isDisabled}
              >
                {STATUS_HIRING_OPTIONS.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Mô tả chi tiết"
              name="description"
              className="md:col-span-2"
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả công việc"
                size="large"
                disabled={isDisabled}
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OtherInfoSection;
