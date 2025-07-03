import { Form, Card, DatePicker } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

type DateSectionProps = {
  mode: ENUM_PAGE_MODE;
};

const DateSection = ({ mode }: DateSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mt-4">Thời gian hiệu lực</h2>
      <div className="mt-6">
        <Form.Item
          name="dateStart"
          label="Hiệu lực từ"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePicker
            className="!h-10 w-full"
            placeholder="Thời gian bắt đầu"
            disabled={isDisabled}
            format="DD-MM-YYYY HH:mm:ss"
            showTime
          />
        </Form.Item>
        <Form.Item name="dateEnd" label="Hiệu lực đến">
          <DatePicker
            className="!h-10 w-full"
            placeholder="Thời gian kết thúc"
            disabled={isDisabled}
            format="DD-MM-YYYY HH:mm:ss"
            showTime
          />
        </Form.Item>
      </div>
    </Card>
  );
};

export default DateSection;
