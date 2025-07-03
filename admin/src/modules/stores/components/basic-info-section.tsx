import { Card, Form, Input } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { GreenSwitch } from "@/components/ui/switch";
import { ENUM_STORE_STATUS } from "../types";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  onStatusChange: (status: ENUM_STORE_STATUS) => void;
};

const BasicInfoSection = ({ mode, onStatusChange }: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  const handleChange = (checked: boolean) => {
    const status = checked
      ? ENUM_STORE_STATUS.ACTIVE
      : ENUM_STORE_STATUS.INACTIVE;
    onStatusChange(status);
  };

  return (
    <Card>
      <h2 className='text-lg font-semibold mb-4'>Thông tin cơ bản</h2>
      <div className='mt-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8'>
          <Form.Item
            label='Tên cửa hàng'
            name='name'
            rules={[{ required: true, message: "Vui lòng nhập tên cửa hàng" }]}
          >
            <Input
              placeholder='Nhập tên cửa hàng'
              size='large'
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label='Slug'
            name='slug'
            rules={[{ required: true, message: "Slug không được để trống" }]}
          >
            <Input
              placeholder='Slug'
              size='large'
              disabled={isDisabled}
              readOnly
            />
          </Form.Item>
          <Form.Item
            label='Địa chỉ'
            name='address'
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input
              placeholder='Nhập địa chỉ'
              size='large'
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            label='Giờ làm việc'
            name='workHours'
            rules={[{ required: true, message: "Vui lòng nhập giờ làm việc" }]}
          >
            <Input
              placeholder='Nhập giờ làm việc'
              size='large'
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item label='Trạng thái' name='status' valuePropName='checked'>
            <GreenSwitch onChange={handleChange} disabled={isDisabled} />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
