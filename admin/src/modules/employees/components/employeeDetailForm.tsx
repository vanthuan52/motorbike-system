import React from "react";
import { Form, Input, Select, DatePicker, Switch, Row, Col } from "antd";
import moment from "moment";
const { Option } = Select;
const { TextArea } = Input;

export class EmployeeForm extends React.Component<any> {
  render() {
    const {
      form,
      isEditing,
      provinces,
      districts,
      wards,
      setSelectedProvince,
      setSelectedDistrict,
      status,
      setStatus,
      employeeData,
      handleFinish,
    } = this.props;

    return (
      <Form
        form={form}
        layout="vertical"
        disabled={!isEditing}
        initialValues={{
          ...employeeData,
          dob: employeeData.dob ? moment(employeeData.dob) : undefined,
        }}
        onFinish={handleFinish}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-100">
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label={<span className="font-semibold">Tên</span>}
                shouldUpdate
              >
                {() =>
                  isEditing ? (
                    <Form.Item
                      name="first_name"
                      noStyle
                      rules={[{ required: true, message: "Bắt buộc" }]}
                    >
                      <Input placeholder="Vui lòng nhập tên" size="large" />
                    </Form.Item>
                  ) : (
                    <div className="field-display">
                      {form.getFieldValue("first_name")}
                    </div>
                  )
                }
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label={<span className="font-semibold">Họ</span>}
                shouldUpdate
              >
                {() =>
                  isEditing ? (
                    <Form.Item
                      name="last_name"
                      noStyle
                      rules={[{ required: true, message: "Bắt buộc" }]}
                    >
                      <Input placeholder="Vui lòng nhập họ" size="large" />
                    </Form.Item>
                  ) : (
                    <div className="field-display">
                      {form.getFieldValue("last_name")}
                    </div>
                  )
                }
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label={<span className="font-semibold">Email</span>}
                shouldUpdate
              >
                {() =>
                  isEditing ? (
                    <Form.Item
                      name="email"
                      noStyle
                      rules={[
                        { required: true, message: "Bắt buộc" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input placeholder="Vui lòng nhập email" size="large" />
                    </Form.Item>
                  ) : (
                    <div className="field-display">
                      {form.getFieldValue("email")}
                    </div>
                  )
                }
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label={<span className="font-semibold">Giới tính</span>}
                shouldUpdate
              >
                {() =>
                  isEditing ? (
                    <Form.Item name="gender" noStyle>
                      <Select size="large">
                        <Option value="MALE">Nam</Option>
                        <Option value="FEMALE">Nữ</Option>
                      </Select>
                    </Form.Item>
                  ) : (
                    <div className="field-display">
                      {form.getFieldValue("gender") === "MALE" ? "Nam" : "Nữ"}
                    </div>
                  )
                }
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label={<span className="font-semibold">Số điện thoại</span>}
                shouldUpdate
              >
                {() =>
                  isEditing ? (
                    <Form.Item
                      name="phone"
                      noStyle
                      rules={[{ required: true, message: "Bắt buộc" }]}
                    >
                      <Input
                        placeholder="Vui lòng nhập số điện thoại"
                        size="large"
                      />
                    </Form.Item>
                  ) : (
                    <div className="field-display">
                      {form.getFieldValue("phone")}
                    </div>
                  )
                }
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label={<span className="font-semibold">Ngày sinh</span>}
                shouldUpdate
              >
                {() =>
                  isEditing ? (
                    <Form.Item name="dob" noStyle>
                      <DatePicker
                        format="YYYY-MM-DD"
                        className="w-full"
                        allowClear
                        size="large"
                      />
                    </Form.Item>
                  ) : (
                    <div className="field-display">
                      {form.getFieldValue("dob")
                        ? moment(form.getFieldValue("dob")).format("DD/MM/YYYY")
                        : ""}
                    </div>
                  )
                }
              </Form.Item>
            </Col>
            <Col xs={24}>
              {isEditing ? (
                <>
                  <Form.Item
                    label={<span className="font-semibold">Địa chỉ</span>}
                    name="address"
                  >
                    <TextArea
                      placeholder="Vui lòng nhập số nhà, tên đường..."
                      rows={2}
                      size="large"
                      style={{ resize: "none" }}
                    />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={
                          <span className="font-semibold">Tỉnh/Thành phố</span>
                        }
                        name="city"
                      >
                        <Select
                          showSearch
                          optionFilterProp="children"
                          placeholder="Chọn Tỉnh/Thành phố"
                          size="large"
                          onChange={(value) => {
                            setSelectedProvince(value);
                            setSelectedDistrict("");
                            form.setFieldsValue({
                              city: value,
                              district: "",
                              ward: "",
                            });
                          }}
                        >
                          {provinces.map((p: any) => (
                            <Option key={p.code} value={p.name}>
                              {p.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={
                          <span className="font-semibold">Quận/Huyện</span>
                        }
                        name="district"
                      >
                        <Select
                          showSearch
                          optionFilterProp="children"
                          placeholder="Chọn Quận/Huyện"
                          size="large"
                          disabled={!form.getFieldValue("city")}
                          onChange={(value) => {
                            setSelectedDistrict(value);
                            form.setFieldsValue({
                              district: value,
                              ward: "",
                            });
                          }}
                        >
                          {districts.map((d: any) => (
                            <Option key={d.code} value={d.name}>
                              {d.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={<span className="font-semibold">Phường/Xã</span>}
                        name="ward"
                      >
                        <Select
                          showSearch
                          optionFilterProp="children"
                          placeholder="Chọn Phường/Xã"
                          size="large"
                          disabled={!form.getFieldValue("district")}
                        >
                          {wards.map((w: any) => (
                            <Option key={w.code} value={w.name}>
                              {w.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                <Form.Item
                  label={<span className="font-semibold">Địa chỉ</span>}
                >
                  <div className="field-display">
                    {[
                      form.getFieldValue("address"),
                      form.getFieldValue("ward"),
                      form.getFieldValue("district"),
                      form.getFieldValue("city"),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </Form.Item>
              )}
            </Col>

            {isEditing ? (
              <Form.Item
                label={<span className="font-semibold">Trạng thái</span>}
              >
                <Form.Item name="status" noStyle>
                  <Switch
                    checked={status === "ACTIVE"}
                    onChange={(checked) => {
                      const newStatus = checked ? "ACTIVE" : "INACTIVE";
                      form.setFieldsValue({ status: newStatus });
                      setStatus(newStatus);
                    }}
                  />
                </Form.Item>
              </Form.Item>
            ) : null}
          </Row>
        </div>
      </Form>
    );
  }
}
export default EmployeeForm;
