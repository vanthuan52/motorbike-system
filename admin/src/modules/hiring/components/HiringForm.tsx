import { Form, Input, Select, Button, Divider, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Hiring, JobTypeEnum } from "../types";
import { STATUS_HIRING_OPTIONS } from "../constants/status";
export default function HiringForm({
  initialValues,
  onSubmit,
  loading = false,
  mode = "edit",
}: {
  initialValues?: Hiring | null;
  onSubmit: (values: Hiring) => void;
  loading?: boolean;
  mode?: "edit" | "create";
}) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (initialValues) {
      const transformedValues = {
        ...initialValues,
        application_deadline: initialValues.application_deadline
          ? dayjs(initialValues.application_deadline)
          : null,
      };
      form.setFieldsValue(transformedValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);
  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      if (
        values.application_deadline &&
        values.application_deadline.isValid &&
        values.application_deadline.isValid()
      ) {
        values.application_deadline =
          values.application_deadline.format("YYYY-MM-DD");
      } else {
        values.application_deadline = null;
      }
      onSubmit(values);
    } catch {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };
  const handleFinishDraft = async () => {
    try {
      const values = await form.validateFields();
      if (
        values.application_deadline &&
        values.application_deadline.isValid &&
        values.application_deadline.isValid()
      ) {
        values.application_deadline =
          values.application_deadline.format("YYYY-MM-DD");
      } else {
        values.application_deadline = null;
      }
      onSubmit({ ...values, status: "draft" });
    } catch {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };
  return (
    <div className="sm:px-4 mt-10 mb-3 sm:mt-10 sm:mb-3 lg:my-8 mx-4 bg-white rounded-xl shadow p-6">
      <div className="flex gap-2 items-center mb-2 w-full">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
      </div>
      <Form form={form} layout="vertical" autoComplete="off">
        <Divider orientation="left">Thông tin cơ bản</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề công việc" size="large" />
          </Form.Item>

          <Form.Item
            label="Hình thức công việc"
            name="job_type"
            rules={[{ required: true, message: "Vui lòng chọn hình thức" }]}
          >
            <Select placeholder="Chọn hình thức công việc" size="large">
              {Object.values(JobTypeEnum).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Mức lương"
            name="salary_range"
            rules={[{ required: true, message: "Vui lòng nhập mức lương" }]}
          >
            <Input
              placeholder="Nhập mức lương (VD: 10-15 triệu)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Hạn nộp hồ sơ"
            name="application_deadline"
            rules={[{ required: true, message: "Vui lòng chọn hạn nộp" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn hạn nộp"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Input placeholder="Nhập danh mục công việc" size="large" />
          </Form.Item>

          <Form.Item
            label="Địa điểm"
            name="location"
            rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
          >
            <Input placeholder="Nhập địa điểm làm việc" size="large" />
          </Form.Item>
        </div>

        <Divider orientation="left">Yêu cầu tuyển dụng</Divider>
        <Form.List name="requirements">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key} className="flex gap-2 mb-2">
                  <Form.Item
                    name={name}
                    className="w-full"
                    rules={[
                      { required: true, message: "Vui lòng nhập yêu cầu" },
                    ]}
                  >
                    <Input placeholder="Nhập yêu cầu công việc" size="large" />
                  </Form.Item>
                  <Button
                    danger
                    onClick={() => remove(name)}
                    icon={<DeleteOutlined />}
                  />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm yêu cầu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Thông tin khác</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái" size="large">
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
            />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2 w-full mt-4">
          <Button
            type="primary"
            icon={mode === "edit" ? <SaveOutlined /> : <PlusOutlined />}
            onClick={handleFinish}
            loading={loading}
          >
            {mode === "edit" ? "Cập nhật" : "Đăng tin"}
          </Button>

          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={handleFinishDraft}
            loading={loading}
            className="border-gray-400 text-gray-700 hover:border-gray-600 hover:text-black"
          >
            Lưu nháp
          </Button>
        </div>
      </Form>
    </div>
  );
}
