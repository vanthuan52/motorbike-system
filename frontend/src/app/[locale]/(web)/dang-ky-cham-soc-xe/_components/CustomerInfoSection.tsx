import { Row, Col, Form, Input } from "antd";

export default function CustomerInfoSection() {
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={<span className="font-semibold text-base">{"Họ và tên"}</span>}
          name="customer"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên của bạn" size="large" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">{"Số điện thoại"}</span>
          }
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^0\d{9}$/, message: "Số điện thoại không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" size="large" />
        </Form.Item>
      </Col>
    </Row>
  );
}
