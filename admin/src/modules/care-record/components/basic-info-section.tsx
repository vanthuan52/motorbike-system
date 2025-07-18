import { Button, Card, Checkbox, Form, Input, Select } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { ENUM_CARE_RECORD_STATUS } from "../types";
import { getCareRecordStatusOptions } from "../constants/care-record";

type BasicInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  onStatusChange: (status: ENUM_CARE_RECORD_STATUS) => void;
};

const BasicInfoSection = ({ mode, onStatusChange }: BasicInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <div className="flex w-full justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
        <Form.Item name="status" className="!w-30">
          <Select
            placeholder="Chọn trạng thái"
            options={getCareRecordStatusOptions()}
            onChange={(value) => onStatusChange(value)}
          />
        </Form.Item>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Form.Item label="Khách hàng" name="name">
            <Input readOnly placeholder="Tên khách hàng" size="large" />
          </Form.Item>
          <Form.Item label="Kỹ thuật viên phụ trách" name="technician">
            <Input size="large" readOnly />
          </Form.Item>
          <div className="flex flex-col">
            <Form.Item label="Thông tin xe" name="vehicleModel">
              <Input size="large" readOnly className="!text-red-500" />
            </Form.Item>
            <Form.Item name="licensePlate">
              <Input size="large" readOnly className="!text-red-500" />
            </Form.Item>
          </div>

          <Form.Item name="confirmedByOwner" valuePropName="checked">
            <div className="flex items-center gap-4 justify-between">
              <span>Xác nhận bởi khách hàng</span>
              <Checkbox className="w-10" />
            </div>
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
