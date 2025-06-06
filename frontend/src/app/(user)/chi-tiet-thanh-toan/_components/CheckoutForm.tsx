"use client";
import { useState } from "react";
import { Form, Input } from "antd";
import Breadcrumb from "./Breadcrumb";
import ShippingMethod from "./ShippingMethod";
import { FormValues } from "./CheckoutPage";
type props = {
  handleSubmit: (values: FormValues) => void;
  onShippingChange: (shippingCost: number) => void;
  form: import("antd").FormInstance<FormValues>;
};
export default function CheckoutForm({
  onShippingChange,
  handleSubmit,
  form,
}: props) {
  type ShippingOption = "free" | "express";
  const [shipping, setShipping] = useState<ShippingOption>("free");
  const shippingOptions: Record<ShippingOption, number> = {
    free: 0,
    express: 45000,
  };

  const handleShippingChange = (value: string) => {
    if (value === "free" || value === "express") {
      setShipping(value);
      onShippingChange(shippingOptions[value]);
    }
  };
  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow ">
      <Breadcrumb />
      <h2 className="text-2xl font-semibold mb-6 mt-2">Địa chỉ giao hàng</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0"
      >
        <Form.Item
          label={
            <span className="font-semibold">
              Họ<span>*</span>
            </span>
          }
          name="first_name"
          rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
          className="col-span-1"
        >
          <Input placeholder="Họ" size="large" />
        </Form.Item>
        <Form.Item
          label={
            <span className="font-semibold">
              Tên<span>*</span>
            </span>
          }
          name="last_name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          className="col-span-1"
        >
          <Input size="large" placeholder="Tên" />
        </Form.Item>
        <Form.Item
          label={
            <span className="font-semibold">
              Email<span>*</span>
            </span>
          }
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Invalid email" },
          ]}
          className="col-span-1"
        >
          <Input size="large" placeholder="Email" />
        </Form.Item>
        <Form.Item
          label={
            <span className="font-semibold">
              Số điện thoại<span>*</span>
            </span>
          }
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          className="col-span-1"
        >
          <Input size="large" placeholder="Số điện thoại" type="number" />
        </Form.Item>
        <div className="flex justify-between w-full gap-4 col-span-2">
          <Form.Item
            label={
              <span className="font-semibold">
                Thành phố<span>*</span>
              </span>
            }
            name="city"
            rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
            className="!w-full"
          >
            <Input size="large" placeholder="Thành phố" />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold">
                Địa chỉ<span>*</span>
              </span>
            }
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            className="!w-full"
          >
            <Input size="large" placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold">
                Zip Code<span>*</span>
              </span>
            }
            name="zip"
            rules={[{ required: true, message: "Vui lòng nhập zip code" }]}
            className="!w-full"
          >
            <Input size="large" placeholder="Zip Code" />
          </Form.Item>
        </div>
        <Form.Item
          label={<span className="font-semibold">Mô tả</span>}
          name="Mô tả"
          className="col-span-2 !w-full"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập mô tả..." rows={3} size="large" />
        </Form.Item>
      </Form>
      <ShippingMethod
        shipping={shipping}
        handleShippingChange={handleShippingChange}
      />
    </div>
  );
}
