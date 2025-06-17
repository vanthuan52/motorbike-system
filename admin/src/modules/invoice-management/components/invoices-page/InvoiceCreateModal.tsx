/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, Form, Input, Select, Button } from "antd";
import { useState } from "react";
import { mockProducts } from "../../mocks/Products";
type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: (data: any) => void;
};

export default function InvoiceCreateModal({
  open,
  onCancel,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSuccess(values);
      setLoading(false);
      onCancel();
      form.resetFields();
    } catch {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Tạo hóa đơn mới"
      open={open}
      onClose={() => {
        onCancel();
        form.resetFields();
      }}
      width={500}
      destroyOnHidden
      footer={
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              onCancel();
              form.resetFields();
            }}
          >
            Hủy
          </Button>
          <Button type="primary" loading={loading} onClick={handleOk}>
            Tạo mới
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "pending",
          payment_status: "pending",
          payment_method: "cod",
        }}
      >
        <Form.Item
          label="Sản phẩm"
          name="products"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            placeholder="Chọn sản phẩm"
            mode="multiple"
            options={mockProducts.map((product) => ({
              value: product.id,
              label: product.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Tên khách hàng"
          name="recipient_name"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Phương thức thanh toán"
          name="payment_method"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn phương thức thanh toán"
            options={[
              { value: "cod", label: "COD" },
              { value: "bank_transfer", label: "Chuyển khoản" },
              { value: "momo", label: "Momo" },
              { value: "credit_card", label: "Thẻ tín dụng" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Hình thức vận chuyển"
          name="shipping_method"
          rules={[{ required: true, message: "Chọn hình thức vận chuyển" }]}
        >
          <Select
            placeholder="Chọn hình thức vận chuyển"
            options={[
              { value: "ghtk", label: "Giao hàng tiết kiệm" },
              { value: "ghn", label: "Giao hàng nhanh" },
              { value: "viettelpost", label: "Viettel Post" },
              { value: "vnpost", label: "Vietnam Post" },
              { value: "ahamove", label: "Ahamove" },
              { value: "grabexpress", label: "Grab express" },
              { value: "nowship", label: "Now ship" },
              { value: "jtexpress", label: "JTE express" },
              { value: "ninjavan", label: "Ninja van" },
              { value: "shop_delivery", label: "Shop giao" },
              { value: "pickup_at_store", label: "Lấy tại cửa hàng" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea placeholder="Nhập ghi chú" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
