"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Form } from "antd";
import { toast } from "sonner";
const CheckoutForm = dynamic(() => import("./CheckoutForm"), { ssr: false });
const CartSummary = dynamic(() => import("./CartSummary"), { ssr: false });

export interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
}

export default function CheckoutPage() {
  const [shippingCost, setShippingCost] = useState(0);
  const [form] = Form.useForm<FormValues>();
  const [total, setTotal] = useState(0);
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      console.log(values);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Lỗi không xác định.");
      }
    }
  };
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CheckoutForm
            form={form}
            handleSubmit={handleSubmit}
            onShippingChange={setShippingCost}
          />
        </div>
        <div>
          <CartSummary
            shippingCost={shippingCost}
            onTotalChange={setTotal}
            subTotal={total}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
