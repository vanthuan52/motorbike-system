import { Row, Col, Form, Select, DatePicker } from "antd";

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
];

export default function ServiceDetailSection({}) {
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={<span className="font-semibold text-base">Ngày đặt lịch</span>}
          name="scheduleDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            size="large"
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          label={<span className="font-semibold text-base">Giờ đặt lịch</span>}
          name="timeSlot"
          rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
        >
          <Select placeholder="Chọn khung giờ" size="large">
            {timeSlots.map((slot) => (
              <Select.Option key={slot} value={slot}>
                {slot}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
}
