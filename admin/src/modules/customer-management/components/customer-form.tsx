import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, DatePicker, Select, Upload, Card } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Button from "@/components/ui/button";
import { imageHelper } from "@/utils/image.helper";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { notificationActions } from "@/modules/notification/store/notification-slice";
import { customerActions } from "../store/customer-slice";
import { ROUTER_PATH } from "@/constants/router-path";

const { Option } = Select;

const CustomerForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, isUpserted } = useAppSelector(
    (state: RootState) => state.customer
  );

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const uploadPhotoProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".png,.jpg,.jpeg",
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        dispatch(
          notificationActions.notify({
            type: "error",
            message: "Chỉ được phép sử dụng hình ảnh",
          })
        );
        return Upload.LIST_IGNORE;
      }
      if (!isLt2M) {
        notificationActions.notify({
          type: "error",
          message: "Kích thước ảnh không được vượt quá 2mb.",
        });
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      form.setFieldsValue({ photo: file });
      return false;
    },
    onChange({ fileList }: { fileList: any }) {
      setFileList(fileList);
    },
    fileList,
    onPreview: imageHelper.onPreviewImage,
  };

  useEffect(() => {
    if (isUpserted) {
      navigate(ROUTER_PATH.CUSTOMERS);
    }
  }, [dispatch, isUpserted]);

  const handleSubmit = (values: any) => {
    dispatch(customerActions.createCustomer({ customer: values }));
    console.log("Form submitted:", values);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <div className="flex w-full justify-between gap-4">
            <Form.Item
              className="w-full"
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item
              className="w-full"
              label="Ngày sinh"
              name="dob"
              rules={[{ required: false }]}
            >
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
              />
            </Form.Item>
          </div>
          <div className="flex w-full justify-between gap-4">
            <Form.Item
              className="w-full"
              label="Địa chỉ Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập Email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              className="w-full"
              label="Số điện thoại"
              name="phone"
              rules={[{ required: false }]}
            >
              <Input addonBefore="+84" placeholder="Nhập số điện thoại" />
            </Form.Item>
          </div>
          <div className="flex w-full justify-between gap-4">
            <Form.Item
              className="w-full"
              label="Giới tính"
              name="gender"
              rules={[{ required: false }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="none">Không cung cấp</Option>
              </Select>
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Địa chỉ"
              name="address"
              rules={[{ required: false }]}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
          </div>
          <div className="flex w-full justify-between gap-4">
            <Form.Item
              className="w-full"
              label="Phường/Xã"
              name="ward"
              rules={[{ required: false }]}
            >
              <Input placeholder="Phường/Xã" />
            </Form.Item>
            <Form.Item
              className="w-full"
              label="Quận/Huyện"
              name="district"
              rules={[{ required: false }]}
            >
              <Input placeholder="Quận/Huyện" />
            </Form.Item>
          </div>
          <div className="flex w-full justify-between gap-4">
            <Form.Item
              className="w-full"
              label="Tỉnh/Thành phố"
              name="city"
              rules={[{ required: false }]}
            >
              <Input placeholder="Tỉnh/Thành phố" />
            </Form.Item>

            <Form.Item
              className="w-full"
              label="Trạng thái"
              name="status"
              rules={[{ required: false }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="blocked">Chặn</Option>
              </Select>
            </Form.Item>
          </div>
        </Card>
        <Card>
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-2">Ảnh đại diện</h3>
            <Form.Item name="photo">
              <Upload.Dragger listType="picture" {...uploadPhotoProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo thả để thêm ảnh</p>
                <p className="ant-upload-hint">.jpg, .png, .jpeg</p>
              </Upload.Dragger>
            </Form.Item>
          </div>
        </Card>

        <div className="md:col-span-2 flex justify-end gap-4">
          <Button
            className="w-20"
            variant={"outline"}
            type="reset"
            disabled={loading}
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant={"primary"}
            className="w-20 !text-white bg-black hover:bg-gray-700"
            loading={loading}
          >
            Lưu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CustomerForm;
