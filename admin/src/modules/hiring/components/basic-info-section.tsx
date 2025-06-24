import { ENUM_PAGE_MODE } from "@/types/app.type";
import { Card, DatePicker, Form, Input, Select } from "antd";
import { ENUM_HIRING_JOB_TYPE } from "../types";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
};
const BasicInfoSection = ({ mode }: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;
  const JOB_TYPE_OPTIONS = [
    { label: "Full-time", value: ENUM_HIRING_JOB_TYPE.FULL_TIME },
    { label: "Part-time", value: ENUM_HIRING_JOB_TYPE.PART_TIME },
    { label: "Hợp đồng", value: ENUM_HIRING_JOB_TYPE.CONTRACT },
    { label: "Khác", value: ENUM_HIRING_JOB_TYPE.ETC },
  ];
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input
              placeholder="Nhập tiêu đề công việc"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Vui lòng nhập Slug" }]}
          >
            <Input
              placeholder="Nhập Slug"
              size="large"
              readOnly
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label="Hình thức công việc"
            name="jobType"
            rules={[{ required: true, message: "Vui lòng chọn hình thức" }]}
          >
            <Select
              placeholder="Chọn hình thức công việc"
              size="large"
              disabled={isDisabled}
            >
              {JOB_TYPE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Mức lương"
            name="salaryRange"
            rules={[{ required: true, message: "Vui lòng nhập mức lương" }]}
          >
            <Input
              placeholder="Nhập mức lương (VD: 10-15 triệu)"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>

          <Form.Item
            label="Hạn nộp hồ sơ"
            name="applicationDeadline"
            rules={[{ required: true, message: "Vui lòng chọn hạn nộp" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn hạn nộp"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Input
              placeholder="Nhập danh mục công việc"
              size="large"
              disabled={isDisabled}
            />
          </Form.Item>

          <Form.Item
            label="Địa điểm"
            name="location"
            rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
          >
            <Input
              placeholder="Nhập địa điểm làm việc"
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
