/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { employeeData } from "@/data/EmployeeData";
import { Form, Input, Image } from "antd";
import { PencilIcon, UserCircle } from "lucide-react";
import { useRef } from "react";

type Props = {
  avatar: string | null;
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  ref: any;
};

export default function ProfileForm({ avatar, setAvatar, ref }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      ref.current?.setFieldsValue({ avatar: url });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-4 px-2">
      <div className="md:col-span-1">
        <h3 className="text-xl font-semibold">Hồ sơ</h3>
        <p className="text-sm text-gray-500 mt-1">
          Thiết lập thông tin tài khoản của bạn
        </p>
      </div>
      <div className="md:col-span-2 grid gap-6">
        <Form layout="vertical" ref={ref} initialValues={employeeData}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-medium">Ảnh đại diện</span>
              <span className="text-sm text-gray-500">
                Ảnh hiển thị trên hồ sơ của bạn
              </span>
            </div>
            <Form.Item className="mb-0">
              <div className="mb-0 !flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer "
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PencilIcon className="mr-2 w-4 h-4" />
                    Sửa ảnh
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="!hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </Form.Item>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="text-sm font-medium">Họ</span>}
              name="first_name"
              className="mb-0"
              rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
            >
              <Input
                placeholder="Nhập tên của bạn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-0 focus:!border-gray-400 hover:!border-gray-400"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Tên</span>}
              name="last_name"
              className="mb-0"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input
                placeholder="Nhập tên của bạn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-0 focus:!border-gray-400 hover:!border-gray-400"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Email</span>}
              name="email"
              className="mb-0"
              rules={[
                { required: true, message: "Vui lòng nhập Email" },
                {
                  type: "email",
                  message: "Vui lòng nhập đúng định dạng",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-0 focus:!border-gray-400 hover:!border-gray-400"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-sm font-medium">Số diện thoại</span>}
              name="phone"
              className="mb-0"
              rules={[
                { required: true, message: "Vui,lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Vui,lòng nhập đúng điện thoại với 10 số",
                },
              ]}
            >
              <Input
                placeholder="0123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:!outline-none focus:!ring-0 focus:!border-gray-400 hover:!border-gray-400"
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
