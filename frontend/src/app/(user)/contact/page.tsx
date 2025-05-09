"use client";

import React from 'react';
import { Layout, Row, Col, Card, Form, Input, Button, Typography } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function ContactHeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        backgroundImage: "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgXeImqT8vB4DOFwHsTf6a6aCbhZvneKvxUxqCjx_No24bE5p3vkCLAV0lITsPlVuwHrwpDah8Azdyx_3cb3Q0eLgyDr4YBW8SuRAwE4XKqHiYo-7suKo9SMEscsgN6xJRme2CRvqMLHQzV/s1600/Anh-bia-Moto-+(6).jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 24px',
        textAlign: 'center',
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <Title level={1} style={{ color: '#fff', fontSize: '2.5rem', marginBottom: 16 }}>
          Liên hệ với chúng tôi
        </Title>
        <Paragraph style={{ color: '#f0f0f0', fontSize: '1.1rem' }}>
          Mọi thắc mắc, yêu cầu hoặc ý kiến đóng góp của bạn là động lực giúp chúng tôi hoàn thiện.
        </Paragraph>
      </div>
    </section>
  );
}

// Kiểu dữ liệu form
interface ContactFormValues {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

function ContactPage() {
  // Khởi tạo Form instance với kiểu
  const [form] = Form.useForm<ContactFormValues>();

  const onFinish = (values: ContactFormValues) => {
    console.log('Form submitted:', values);
    form.resetFields();
  };

  return (
    <Layout style={{ background: '#f0f2f5' }}>
      <Content style={{ padding: '60px 24px' }}>
        <ContactHeroSection />

        <Row justify="center" style={{ marginBottom: 48, marginTop: 24 }}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: '#001529' }}>
                Liên hệ với chúng tôi
              </Title>
              <Paragraph style={{ color: '#595959', fontSize: 16 }}>
                Chia sẻ thắc mắc, góp ý hoặc bất kỳ yêu cầu nào, chúng tôi sẽ phản hồi trong vòng 24h.
              </Paragraph>
            </div>
          </Col>
        </Row>

        <Row gutter={[32, 32]} align="top">
          {/* Thông tin liên hệ cố định */}
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{ borderRadius: 12, background: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <EnvironmentOutlined style={{ fontSize: 28, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Title level={4}>Địa chỉ</Title>
                  <Paragraph style={{ margin: 0 }}>123 Nguyễn Văn Cừ, Quận 5, TP.HCM</Paragraph>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <PhoneOutlined style={{ fontSize: 28, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Title level={4}>Hotline</Title>
                  <Paragraph style={{ margin: 0 }}>
                    <a href="tel:0123456789">0123 456 789</a>
                  </Paragraph>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <MailOutlined style={{ fontSize: 28, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Title level={4}>Email</Title>
                  <Paragraph style={{ margin: 0 }}>
                    info@baoduongxe.com
                  </Paragraph>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ClockCircleOutlined style={{ fontSize: 28, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Title level={4}>Giờ làm việc</Title>
                  <Paragraph style={{ margin: 0 }}>Thứ 2 - Chủ Nhật: 8:00 - 20:00</Paragraph>
                </div>
              </div>
            </Card>
          </Col>

          {/* Form liên hệ */}
          <Col xs={24} md={16}>
            <Card
              bordered={false}
              style={{ borderRadius: 12, background: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                scrollToFirstError
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                      <Input placeholder="Nguyễn Văn A" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
                    >
                      <Input placeholder="0123 456 789" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' },
                      ]}
                    >
                      <Input placeholder="example@mail.com" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="subject"
                      label="Tiêu đề"
                      rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                      <Input placeholder="Tiêu đề liên hệ" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="message"
                  label="Nội dung"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                >
                  <Input.TextArea rows={6} placeholder="Nội dung chi tiết" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    Gửi
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Bản đồ */}
        <Row style={{ marginTop: 48 }}>
          <Col span={24}>
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <iframe
                title="Bản đồ địa điểm"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2497746976566!2d106.6799836153345!3d10.791517161858927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292aa5b5d4b1%3A0xb497d880e6c9b450!2zMTIzIE5ndXnhu4VuIFbEg24gQ-G7rywgUXXDoW4gNSwgVGjDoG5oIHBo4buRIFRow6BuaCBQaOG7pywgSOG7kyBDaMOidQ!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%"
                height="400"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default ContactPage;