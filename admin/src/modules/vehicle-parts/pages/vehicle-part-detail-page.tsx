"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { mockDataTableVehiclePart } from "@/modules/vehicle-parts/mocks/vehicle-part-data";
import { PartType } from "@/modules/vehicle-parts/types/types";

const { Option } = Select;

export const VehiclePartDetailPage: React.FC = () => {
  const { action, id } = useParams<{ action: string; id?: string }>();
  const navigate = useNavigate();
  const isEdit = (action === "edit" || action === "view") && !!id;
  const [form] = Form.useForm<PartType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEdit) {
      const found = mockDataTableVehiclePart.find(item => item.id === id);
      if (found) {
        form.setFieldsValue(found as any);
      } else {
        message.error("Không tìm thấy phụ tùng");
        navigate(-1);
      }
    }
    setLoading(false);
  }, [isEdit, id, form, navigate]);

  const onFinish = (values: any) => {
    if (isEdit) {
      console.log("Cập nhật phụ tùng:", values);
      message.success("Cập nhật thành công");
    } else {
      console.log("Tạo mới phụ tùng:", values);
      message.success("Tạo mới thành công");
    }
    navigate(-1);
  };

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  if (loading) return <div className="p-4 text-gray-600">Đang tải...</div>;

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Chỉnh sửa phụ tùng" : "Tạo phụ tùng mới"}
      </h2>
      <Form<PartType>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: true }}
      >
        <Form.Item name="vehicle_type_id" label="Mã hãng xe" rules={[{ required: true }]}>  
          <Select placeholder="Chọn hãng xe">
            {/* map options từ API hoặc mock */}
            <Option value="1">Hãng A</Option>
            <Option value="2">Hãng B</Option>
          </Select>
        </Form.Item>

        <Form.Item name="name" label="Tên phụ tùng" rules={[{ required: true }]}>  
          <Input placeholder="Nhập tên phụ tùng" />
        </Form.Item>

        <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]}>  
          <Input type="number" placeholder="Nhập giá" />
        </Form.Item>

        <Form.Item name="image" label="Ảnh phụ tùng" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload name="image" listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>  
          <Select>
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Không hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
          <Button className="ml-2" onClick={() => navigate(-1)}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
