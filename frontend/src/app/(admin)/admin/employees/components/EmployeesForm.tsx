/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";

interface EmployeesFormProps {
  form: any;
}

const EmployeesForm: React.FC<EmployeesFormProps> = ({ form }) => {
  const [photoList, setPhotoList] = useState<UploadFile<any>[]>([]);
  return (
    <Form form={form} layout="vertical">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col items-center w-full sm:flex-row sm:items-start sm:gap-6">
          <div className="flex flex-col items-center w-full sm:w-1/3 mb-4 sm:mb-0">
            <Form.Item
              name="photo"
              label="Ảnh đại diện"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (!e) return [];
                if (Array.isArray(e)) return e;
                return e?.fileList || [];
              }}
            >
              <Upload
                name="avatar"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
                fileList={photoList}
                onChange={({ fileList }) => {
                  const newFileList = fileList.map((file) => {
                    if (file.originFileObj && !file.thumbUrl && !file.url) {
                      return {
                        ...file,
                        thumbUrl: URL.createObjectURL(file.originFileObj),
                      };
                    }
                    return file;
                  });
                  setPhotoList(newFileList);
                  form.setFieldsValue({ photo: newFileList });
                }}
                showUploadList={false}
              >
                <div className="flex flex-col items-center gap-2">
                  {photoList.length > 0 ? (
                    <img
                      src={
                        photoList[0].thumbUrl ||
                        photoList[0].url ||
                        (photoList[0].originFileObj
                          ? URL.createObjectURL(photoList[0].originFileObj)
                          : undefined)
                      }
                      alt="avatar"
                      className="w-40 h-40 sm:w-80 sm:h-80 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : Array.isArray(form.getFieldValue("photo")) && form.getFieldValue("photo").length > 0 ? (
                    <img
                      src={
                        form.getFieldValue("photo")[0].thumbUrl ||
                        form.getFieldValue("photo")[0].url
                      }
                      alt="avatar"
                      className="w-40 h-40 sm:w-80 sm:h-80 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-40 h-40 sm:w-80 sm:h-80 bg-gray-100 flex items-center justify-center border">
                      <UserOutlined style={{ fontSize: 40, color: "#aaa" }} />
                    </div>
                  )}
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                  <span className="text-gray-400 text-sm">
                    Chỉ được tải lên 1 ảnh
                  </span>
                </div>
              </Upload>
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-2/3">
            <Form.Item
              name="first_name"
              label="Họ"
              rules={[{ required: true, message: "Nhập họ nhân viên" }]}
            >
              <Input placeholder="Nhập họ nhân viên" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Tên"
              rules={[{ required: true, message: "Nhập tên nhân viên" }]}
            >
              <Input placeholder="Nhập tên nhân viên" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Nhập email" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Nhập số điện thoại" }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Nhập mật khẩu" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item
              name="dob"
              label="Ngày sinh"
              rules={[{ required: true, message: "Nhập ngày sinh" }]}
            >
              <Input type="date" placeholder="Nhập ngày sinh" />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Chọn giới tính">
                <Select.Option value="MALE">Nam</Select.Option>
                <Select.Option value="FEMALE">Nữ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item name="ward" label="Phường">
              <Input placeholder="Nhập phường" />
            </Form.Item>
            <Form.Item name="district" label="Huyện">
              <Input placeholder="Nhập huyện" />
            </Form.Item>
            <Form.Item name="city" label="Thành phố">
              <Input placeholder="Nhập thành phố" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="ACTIVE">Còn hoạt động</Select.Option>
                <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
          <Form.Item
            name="employee_code"
            label="Mã nhân viên"
            rules={[{ required: true, message: "Nhập mã nhân viên" }]}
          >
            <Input placeholder="Nhập mã nhân viên" />
          </Form.Item>
          <Form.Item
            name="position"
            label="Vị trí"
            rules={[{ required: true, message: "Nhập vị trí" }]}
          >
            <Input placeholder="Nhập vị trí" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="TECHNICIAN">Kỹ thuật viên</Select.Option>
              <Select.Option value="MANAGER">Quản lý</Select.Option>
              <Select.Option value="MANAGER">Quản lý</Select.Option>
              <Select.Option value="MODERATOR">Người điều chỉnh</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: "Nhập ngày bắt đầu" }]}
          >
            <Input type="date" placeholder="Nhập ngày bắt đầu" />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default EmployeesForm;
