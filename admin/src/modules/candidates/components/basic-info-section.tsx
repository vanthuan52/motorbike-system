import { Card, DatePicker, Form, Input, Select } from "antd";
import { ENUM_CANDIDATE_STATUS } from "../types";
import { SelectOptionItem } from "@/components/ui/ant-design/select-option";
import { Hiring } from "@/modules/hiring/types";

type BasicInfoSectionProps = {
  onStatusChange: (status: ENUM_CANDIDATE_STATUS) => void;
  hiringDetail?: Hiring | null;
};

const BasicInfoSection = ({
  onStatusChange,
  hiringDetail,
}: BasicInfoSectionProps) => {
  const statusOptions: SelectOptionItem[] = [
    { value: ENUM_CANDIDATE_STATUS.NEW, label: "Mới" },
    { value: ENUM_CANDIDATE_STATUS.HIRED, label: "Đã tuyển" },
    {
      value: ENUM_CANDIDATE_STATUS.INTERVIEW_SCHEDULED,
      label: "Đã lên lịch hẹn",
    },
    { value: ENUM_CANDIDATE_STATUS.REJECTED, label: "Đã từ chối" },
    { value: ENUM_CANDIDATE_STATUS.REVIEWED, label: "Đã xem" },
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item label="Tên bài tuyển dụng">
            <Input size="large" readOnly value={hiringDetail?.title} />
          </Form.Item>

          <Form.Item label="Tên ứng viên" name="name">
            <Input size="large" readOnly />
          </Form.Item>

          <Form.Item label="Email ứng viên" name="email">
            <Input size="large" readOnly />
          </Form.Item>

          <Form.Item label="Số điện thoại ứng viên" name="phone">
            <Input size="large" readOnly />
          </Form.Item>

          <Form.Item label="Ứng tuyển ngày" name="appliedAt">
            <DatePicker size="large" readOnly />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              size="large"
              options={statusOptions}
              onChange={(value: ENUM_CANDIDATE_STATUS) => onStatusChange(value)}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
