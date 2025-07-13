import { Card, Form, Input, DatePicker, Select, TimePicker } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_APPOINTMENTS_STATUS } from "../types";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  onStatusChange: (status: ENUM_APPOINTMENTS_STATUS) => void;
};

const statusOptions = [
  { label: "Đang chờ", value: ENUM_APPOINTMENTS_STATUS.PENDING },
  { label: "Sắp tới", value: ENUM_APPOINTMENTS_STATUS.UPCOMING },
  { label: "Đã tiếp nhận", value: ENUM_APPOINTMENTS_STATUS.DONE },
];

const BasicInfoSection = ({ mode, onStatusChange }: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const handleStatusChange = (value: ENUM_APPOINTMENTS_STATUS) => {
    onStatusChange(value);
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <Form.Item
          label="Tên khách hàng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
        >
          <Input
            placeholder="Nhập tên khách hàng"
            size="large"
            disabled={isDisabled}
          />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input
            placeholder="Nhập số điện thoại"
            size="large"
            disabled={isDisabled}
          />
        </Form.Item>

        <Form.Item
          label="Ngày hẹn"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn ngày hẹn" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            size="large"
            style={{ width: "100%" }}
            disabled={isDisabled}
          />
        </Form.Item>

        <Form.Item
          label="Khung giờ"
          name="time"
          rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}
        >
          <TimePicker
            format="HH:mm"
            size="large"
            style={{ width: "100%" }}
            disabled={isDisabled}
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            options={statusOptions}
            placeholder="Chọn trạng thái"
            size="large"
            onChange={handleStatusChange}
            disabled={isDisabled}
          />
        </Form.Item>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
