import { ENUM_PAGE_MODE } from "@/types/app.type";
import { Card, Form, Input } from "antd";

type OtherInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
};

const OtherInfoSection = ({ mode }: OtherInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;
  return (
    <Card>
      <h2 className='text-lg font-semibold mb-4'>Thông tin khác</h2>
      <div className='mt-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8'>
          <Form.Item
            label='Ghi chú'
            name='description'
            className='md:col-span-2'
          >
            <Input.TextArea
              rows={2}
              placeholder='Nhập ghi chú'
              size='large'
              disabled={isDisabled}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default OtherInfoSection;
