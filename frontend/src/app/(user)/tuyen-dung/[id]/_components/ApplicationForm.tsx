"use client";

import {
  Input,
  Form,
  Upload,
  Button,
  Radio,
  ConfigProvider,
  theme,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

export default function ApplicationForm() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#000000",
          colorText: "#1f1f1f",
          colorBgContainer: "#ffffff",
          colorBorder: "#d9d9d9",
          borderRadius: 8,
          fontSize: 16,
        },
      }}
    >
      <Form layout="vertical" className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="firstName"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ" }]}
          >
            <Input size="large" placeholder="Nhập họ" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input size="large" placeholder="Nhập tên" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input size="large" placeholder="Số điện thoại" />
          </Form.Item>
        </div>

        <Form.Item
          name="message"
          label="Bạn muốn chia sẻ điều gì với chúng tôi?"
        >
          <Input.TextArea
            rows={4}
            placeholder="Giới thiệu bản thân, mong muốn, kinh nghiệm..."
            size="large"
          />
        </Form.Item>

        <Form.Item name="resume" label="CV (tối đa 4MB, pdf/doc)">
          <Dragger maxCount={1} accept=".pdf,.doc,.docx" height={150}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-sm text-gray-600">
              Kéo & thả hoặc{" "}
              <span className="text-blue-500 underline">chọn tệp</span>
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item
          name="experience"
          label="Bạn có bao nhiêu năm kinh nghiệm?"
          rules={[{ required: true, message: "Vui lòng chọn kinh nghiệm" }]}
        >
          <Radio.Group size="large" rootClassName="!flex flex-col !space-y-2">
            <Radio value="0-2">0-2 năm</Radio>
            <Radio value="3-5">3-5 năm</Radio>
            <Radio value=">5">Hơn 5 năm</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="bg-black hover:bg-gray-800 px-6"
          >
            Gửi đơn ứng tuyển
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
}
