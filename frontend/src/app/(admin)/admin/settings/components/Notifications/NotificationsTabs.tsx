"use client";
import { Form } from "antd";
import { useRef } from "react";
import { toast } from "react-toastify";
import { GreenSwitch } from "@/components/ui/Switch";
type NotificationFormValues = {
  productUpdate: boolean;
  comment: boolean;
  reminder: boolean;
  newMessage: boolean;
  invite: boolean;
  sound: boolean;
};

export default function NotificationsTabs() {
  const [form] = Form.useForm<NotificationFormValues>();

  const initialValues: NotificationFormValues = {
    productUpdate: true,
    comment: true,
    reminder: true,
    newMessage: true,
    invite: true,
    sound: false,
  };

  const prevValuesRef = useRef<NotificationFormValues>(initialValues);

  const fieldLabels: Record<keyof NotificationFormValues, string> = {
    productUpdate: "Sản phẩm",
    comment: "Bình luận",
    reminder: "Nhắc nhở",
    newMessage: "Tin nhắn mới",
    invite: "Lời mời kết nối",
    sound: "Âm thanh thông báo",
  };

  const handleFinish = (values: NotificationFormValues) => {
    const prev = prevValuesRef.current;
    const changedFields = (
      Object.keys(values) as (keyof NotificationFormValues)[]
    ).filter((key) => values[key] !== prev[key]);

    if (changedFields.length > 0) {
      changedFields.forEach((field) => {
        toast.success(`Đã cập nhật: ${fieldLabels[field]}`);
      });

      prevValuesRef.current = values;
    } else {
      toast("Không có thay đổi");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 my-6 px-2">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        className="space-y-8 mt-6"
        onValuesChange={() => form.submit()}
      >
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold">Thông báo Email</h3>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý cách bạn nhận thông báo qua email
            </p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <Form.Item
              label={
                <div>
                  <p className="font-medium mb-0">Cập nhật sản phẩm</p>
                  <p className="text-sm text-gray-500 mb-0">
                    Nhận thông báo về các tính năng mới và cập nhật
                  </p>
                </div>
              }
              name="productUpdate"
              valuePropName="checked"
              className="mb-0"
            >
              <GreenSwitch className="!bg-gray-200" />
            </Form.Item>
            <hr className="border-gray-200" />
            <Form.Item
              label={
                <div>
                  <p className="font-medium mb-0">Bình luận</p>
                  <p className="text-sm text-gray-500 mb-0">
                    Nhận thông báo khi có người bình luận về bài viết của bạn
                  </p>
                </div>
              }
              name="comment"
              valuePropName="checked"
              className="mb-0"
            >
              <GreenSwitch />
            </Form.Item>
            <hr className="border-gray-200" />
            <Form.Item
              label={
                <div>
                  <p className="font-medium mb-0">Nhắc nhở</p>
                  <p className="text-sm text-gray-500 mb-0">
                    Nhận nhắc nhở về các nhiệm vụ và sự kiện sắp tới
                  </p>
                </div>
              }
              name="reminder"
              valuePropName="checked"
              className="mb-0"
            >
              <GreenSwitch />
            </Form.Item>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold">Thông báo ứng dụng</h3>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý thông báo trong ứng dụng
            </p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <Form.Item
              label={
                <div>
                  <p className="font-medium mb-0">Tin nhắn mới</p>
                  <p className="text-sm text-gray-500 mb-0">
                    Hiển thị thông báo khi có tin nhắn mới
                  </p>
                </div>
              }
              name="newMessage"
              valuePropName="checked"
              className="mb-0"
            >
              <GreenSwitch />
            </Form.Item>
            <hr className="border-gray-200" />
            <Form.Item
              label={
                <div>
                  <p className="font-medium mb-0">Lời mời kết nối</p>
                  <p className="text-sm text-gray-500 mb-0">
                    Hiển thị thông báo khi có lời mời kết nối mới
                  </p>
                </div>
              }
              name="invite"
              valuePropName="checked"
              className="mb-0"
            >
              <GreenSwitch />
            </Form.Item>
            <hr className="border-gray-200" />
            <Form.Item
              label={
                <div>
                  <p className="font-medium mb-0">Âm thanh thông báo</p>
                  <p className="text-sm text-gray-500 mb-0">
                    Phát âm thanh khi nhận được thông báo
                  </p>
                </div>
              }
              name="sound"
              valuePropName="checked"
              className="mb-0"
            >
              <GreenSwitch />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
}
