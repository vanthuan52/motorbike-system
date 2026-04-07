"use client";
import { useState } from "react";
import { Form, Input } from "antd";
import { useTranslations } from "next-intl";
import Breadcrumb from "./Breadcrumb";
import ShippingMethod from "./ShippingMethod";
import { FormValues } from "./CheckoutPage";
import { TRANSLATION_FILES } from "@/lib/i18n";

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
  const t = useTranslations(TRANSLATION_FILES.CHECKOUT_PAGE);
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
    <div className="bg-surface p-4 sm:p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]">
      <Breadcrumb />
      <h2 className="text-2xl font-semibold mb-6 mt-2 text-text-primary">
        {t("shippingAddressTitle")}
      </h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0"
      >
        <Form.Item
          label={
            <span className="font-semibold text-text-primary">
              {t("firstName")}
              <span className="text-error">*</span>
            </span>
          }
          name="first_name"
          rules={[{ required: true, message: t("firstNameRequired") }]}
          className="col-span-1"
        >
          <Input placeholder={t("firstName")} size="large" />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-semibold text-text-primary">
              {t("lastName")}
              <span className="text-error">*</span>
            </span>
          }
          name="last_name"
          rules={[{ required: true, message: t("lastNameRequired") }]}
          className="col-span-1"
        >
          <Input placeholder={t("lastName")} size="large" />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-semibold text-text-primary">
              {t("email")}
              <span className="text-error">*</span>
            </span>
          }
          name="email"
          rules={[
            { required: true, message: t("emailRequired") },
            { type: "email", message: t("emailInvalid") },
          ]}
          className="col-span-1"
        >
          <Input placeholder={t("email")} size="large" />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-semibold text-text-primary">
              {t("phone")}
              <span className="text-error">*</span>
            </span>
          }
          name="phone"
          rules={[{ required: true, message: t("phoneRequired") }]}
          className="col-span-1"
        >
          <Input placeholder={t("phone")} size="large" type="tel" />
        </Form.Item>

        <div className="flex justify-between w-full gap-4 col-span-2">
          <Form.Item
            label={
              <span className="font-semibold text-text-primary">
                {t("city")}
                <span className="text-error">*</span>
              </span>
            }
            name="city"
            rules={[{ required: true, message: t("cityRequired") }]}
            className="!w-full"
          >
            <Input placeholder={t("city")} size="large" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-text-primary">
                {t("address")}
                <span className="text-error">*</span>
              </span>
            }
            name="address"
            rules={[{ required: true, message: t("addressRequired") }]}
            className="!w-full"
          >
            <Input placeholder={t("address")} size="large" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-text-primary">
                {t("zip")}
                <span className="text-error">*</span>
              </span>
            }
            name="zip"
            rules={[{ required: true, message: t("zipRequired") }]}
            className="!w-full"
          >
            <Input placeholder={t("zip")} size="large" />
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="font-semibold text-text-primary">{t("description")}</span>}
          name="description"
          className="col-span-2 !w-full"
        >
          <Input.TextArea
            placeholder={t("description")}
            rows={3}
            size="large"
          />
        </Form.Item>
      </Form>
      <ShippingMethod
        shipping={shipping}
        handleShippingChange={handleShippingChange}
      />
    </div>
  );
}
