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
import CustomerVehicles from "@/modules/customer-management/components/customer-vehicle";
import { vehicleData } from "@/modules/customer-management/mocks/customer-vehicle";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { customerActions } from "../store/customer-slice";
import { ENUM_USER_GENDER, ENUM_USER_STATUS, User } from "@/modules/user/types";
import InfoItem from "../components/info-item";

const CustomerDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user: customer, loading } = useAppSelector(
    (state: RootState) => state.customer
  );

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState(vehicleData);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(customerActions.getCustomerDetail({ customerId: id ?? "" }));
  }, [dispatch]);

  useEffect(() => {
    setEditing(searchParams.get("edit") === "1");
  }, [searchParams]);

  const handleSave = (values: Partial<User>) => {
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-600">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!customer) {
    return <div className="p-4 text-red-600">Không tìm thấy khách hàng</div>;
  }

  const statusIcon =
    customer.status === ENUM_USER_STATUS.ACTIVE ? (
      <CheckCircleOutlined className="text-green-500" />
    ) : customer.status === ENUM_USER_STATUS.INACTIVE ? (
      <PauseCircleOutlined className="text-yellow-500" />
    ) : (
      <StopOutlined className="text-gray-400" />
    );

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
      <div className="flex gap-2 items-center mb-4 w-full">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar size={120} icon={<UserOutlined />} src={customer.photo} />
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {customer.name}
          </h2>
          <div className="flex items-center justify-center md:justify-start mt-1 gap-2">
            {statusIcon}
            <span className="text-sm text-gray-700">
              {customer.status === ENUM_USER_STATUS.ACTIVE
                ? "Đang hoạt động"
                : customer.status === ENUM_USER_STATUS.INACTIVE
                  ? "Không hoạt động"
                  : "Đã bị khóa"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        {searchParams.get("edit") === "1" && !editing && (
          <Button type="primary" onClick={() => setEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      <hr className="border-t border-gray-300 my-6" />

      {!editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
          <InfoItem icon={<MailOutlined />} label={customer.email ?? ""} />
          <InfoItem
            icon={
              customer.gender === ENUM_USER_GENDER.MALE ? (
                <ManOutlined />
              ) : (
                <WomanOutlined />
              )
            }
            label={customer.gender === ENUM_USER_GENDER.MALE ? "Nam" : "Nữ"}
          />
          <InfoItem
            icon={<EnvironmentOutlined />}
            label={`${customer.address}, ${customer.ward}, ${customer.district}, ${customer.city}`}
          />
          <InfoItem icon={<PhoneOutlined />} label={customer.phone ?? ""} />
          <InfoItem
            icon={<CalendarOutlined />}
            label={moment(customer.dob).format("DD-MM-YYYY")}
          />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: customer.name,
            email: customer.email,
            gender: customer.gender,
            address: customer.address,
            phone: customer.phone,
            dob: customer.dob,
            ward: customer.ward,
            district: customer.district,
            city: customer.city,
          }}
          onFinish={handleSave}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select>
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phường/Xã"
            name="ward"
            rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tỉnh/Thành phố"
            name="city"
            rules={[
              { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="dob"
            rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
          >
            <Input type="date" />
          </Form.Item>
          <div className="col-span-full flex gap-2 justify-end">
            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit">
                Lưu thay đổi
              </Button>
            </Form.Item>
            <Button onClick={() => setEditing(false)} type="default">
              Hủy
            </Button>
          </div>
        </Form>
      )}

      <CustomerVehicles
        customerId={customer._id}
        vehicleData={vehicles}
        editable={editing}
        onChange={(newVehicles) =>
          setVehicles((prev) =>
            prev.map((v) =>
              v.customer_id === customer._id
                ? newVehicles.find((nv) => nv.id === v.id) || v
                : v
            )
          )
        }
      />
    </div>
  );
};

export default CustomerDetailPage;
