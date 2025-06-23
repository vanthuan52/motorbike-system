import { ENUM_PAGE_MODE } from "@/types/app.type";
import { Form, Input, Card } from "antd";

type AddressSectionProps = {
  mode: ENUM_PAGE_MODE;
};

const AddressSection = ({ mode }: AddressSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Địa chỉ</h2>
      <div className="mt-4">
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4">
          <Form.Item className="w-full" label="Địa chỉ" name="address">
            <Input placeholder="Địa chỉ" disabled={isDisabled} />
          </Form.Item>
          <Form.Item className="w-full" label="Phường/Xã" name="ward">
            <Input placeholder="Phường/Xã" disabled={isDisabled} />
          </Form.Item>
        </div>
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4">
          <Form.Item className="w-full" label="Quận/Huyện" name="district">
            <Input placeholder="Quận/Huyện" disabled={isDisabled} />
          </Form.Item>
          <Form.Item className="w-full" label="Tỉnh/Thành phố" name="city">
            <Input placeholder="Tỉnh/Thành phố" disabled={isDisabled} />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default AddressSection;
