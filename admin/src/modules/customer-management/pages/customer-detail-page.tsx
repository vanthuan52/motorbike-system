"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Avatar, Button, Form, Input, Select } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ManOutlined,
  WomanOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { CustomerType } from "@/modules/customer-management/types/types";
import { mockDataTableManageCustomers } from "@/modules/customer-management/mocks/customer-data";
import CustomerVehicles from "@/modules/customer-management/components/customer-vehicle";
import { vehicleData } from "@/modules/customer-management/mocks/customer-vehicle";
import { toast } from "react-toastify";

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [customerData, setCustomerData] = useState<CustomerType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState(vehicleData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const found = mockDataTableManageCustomers.find(item => item.id === id);
    setCustomerData(found ?? null);
    setLoading(false);
    if (found) {
      form.setFieldsValue({
        first_name: found.first_name,
        last_name: found.last_name,
        email: found.email,
        gender: found.gender,
        address: found.address,
        phone: found.phone,
        dob: found.dob,
        ward: found.ward,
        district: found.district,
        city: found.city,
      });
    }
  }, [id, form]);

  useEffect(() => {
    setEditing(searchParams.get("edit") === "1");
  }, [searchParams]);

  const handleSave = (values: Partial<CustomerType>) => {
    setCustomerData(prev =>
      prev
        ? {
            ...prev,
            ...values,
          }
        : prev
    );
    setEditing(false);
    toast.success("Cập nhật thông tin thành công!");
  };

  if (loading)
    return <div className='p-4 text-gray-600'>Đang tải dữ liệu...</div>;
  if (!customerData)
    return <div className='p-4 text-red-600'>Không tìm thấy khách hàng</div>;

  const statusIcon =
    customerData.status === "ACTIVE" ? (
      <CheckCircleOutlined className='text-green-500' />
    ) : customerData.status === "INACTIVE" ? (
      <PauseCircleOutlined className='text-yellow-500' />
    ) : (
      <StopOutlined className='text-gray-400' />
    );

  return (
    <div className='w-full px-4 md:px-6 lg:px-8 py-6'>
      <div className='flex gap-2 items-center mb-4 w-full'>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
      </div>
      <div className='flex flex-col md:flex-row items-center gap-6'>
        <Avatar size={120} icon={<UserOutlined />} src={customerData.photo} />
        <div className='text-center md:text-left'>
          <h2 className='text-2xl md:text-3xl font-semibold'>
            {customerData.first_name} {customerData.last_name}
          </h2>
          <div className='flex items-center justify-center md:justify-start mt-1 gap-2'>
            {statusIcon}
            <span className='text-sm text-gray-700'>
              {customerData.status === "ACTIVE"
                ? "Đang hoạt động"
                : customerData.status === "INACTIVE"
                  ? "Không hoạt động"
                  : "Đã bị khóa"}
            </span>
          </div>
        </div>
      </div>

      <div className='flex justify-end mt-4'>
        {searchParams.get("edit") === "1" && !editing && (
          <Button type='primary' onClick={() => setEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      <hr className='border-t border-gray-300 my-6' />

      {!editing ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700'>
          <InfoItem icon={<MailOutlined />} label={customerData.email ?? ""} />
          <InfoItem
            icon={
              customerData.gender === "MALE" ? (
                <ManOutlined />
              ) : (
                <WomanOutlined />
              )
            }
            label={customerData.gender === "MALE" ? "Nam" : "Nữ"}
          />
          <InfoItem
            icon={<EnvironmentOutlined />}
            label={`${customerData.address}, ${customerData.ward}, ${customerData.district}, ${customerData.city}`}
          />
          <InfoItem icon={<PhoneOutlined />} label={customerData.phone ?? ""} />
          <InfoItem
            icon={<CalendarOutlined />}
            label={moment(customerData.dob).format("DD-MM-YYYY")}
          />
        </div>
      ) : (
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            first_name: customerData.first_name,
            last_name: customerData.last_name,
            email: customerData.email,
            gender: customerData.gender,
            address: customerData.address,
            phone: customerData.phone,
            dob: customerData.dob,
            ward: customerData.ward,
            district: customerData.district,
            city: customerData.city,
          }}
          onFinish={handleSave}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        >
          <Form.Item
            label='Họ'
            name='first_name'
            rules={[{ required: true, message: "Vui lòng nhập họ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Tên'
            name='last_name'
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Giới tính'
            name='gender'
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select>
              <Select.Option value='MALE'>Nam</Select.Option>
              <Select.Option value='FEMALE'>Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Địa chỉ'
            name='address'
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Phường/Xã'
            name='ward'
            rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Quận/Huyện'
            name='district'
            rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Tỉnh/Thành phố'
            name='city'
            rules={[
              { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Số điện thoại'
            name='phone'
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Ngày sinh'
            name='dob'
            rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
          >
            <Input type='date' />
          </Form.Item>
          <div className='col-span-full flex gap-2 justify-end'>
            <Form.Item className='mb-0'>
              <Button type='primary' htmlType='submit'>
                Lưu thay đổi
              </Button>
            </Form.Item>
            <Button onClick={() => setEditing(false)} type='default'>
              Hủy
            </Button>
          </div>
        </Form>
      )}

      <CustomerVehicles
        customerId={customerData.id}
        vehicleData={vehicles}
        editable={editing}
        onChange={newVehicles =>
          setVehicles(prev =>
            prev.map(v =>
              v.customer_id === customerData.id
                ? newVehicles.find(nv => nv.id === v.id) || v
                : v
            )
          )
        }
      />
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className='flex items-center gap-3'>
    <div className='text-gray-500'>{icon}</div>
    <span className='text-sm font-medium break-words'>{label}</span>
  </div>
);

export default CustomerDetailPage;
