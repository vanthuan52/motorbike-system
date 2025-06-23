import { Form, Input, DatePicker, Card } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

type GeneralInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
};

const GeneralInfoSection = ({ mode }: GeneralInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
      <div className="mt-4">
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4">
          <Form.Item
            className="w-full"
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Họ và tên" disabled={isDisabled} />
          </Form.Item>
          <Form.Item
            className="w-full"
            label="Địa chỉ Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Email" disabled={isDisabled} />
          </Form.Item>
        </div>
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4">
          <Form.Item className="w-full" label="Số điện thoại" name="phone">
            <Input
              addonBefore="+84"
              placeholder="Nhập số điện thoại"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item className="w-full" label="Ngày sinh" name="dob">
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              disabled={isDisabled}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default GeneralInfoSection;
