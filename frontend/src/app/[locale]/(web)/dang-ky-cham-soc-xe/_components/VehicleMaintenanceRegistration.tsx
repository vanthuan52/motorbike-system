"use client";

import { useTranslations } from "next-intl";
import { Form, Input, Button } from "antd";
import BookingTabs from "./BookingTabs";
import CustomerInfoSection from "./CustomerInfoSection";
import VehicleInfoSection from "./VehicleInfoSection";
import ServiceDetailSection from "./ServiceDetailSection";
import PickupInfoSection from "./PickupInfoSection";
import PickupMapSection from "./PickupMapSection";
import PickupCostSection from "./PickupCostSection";
import { useBookingForm } from "../../../../../features/appointment/hooks/useBookingForm";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function VehicleMaintenanceRegistration() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  const { form, serviceType, handleTabChange, handleFinish, submitLoading } =
    useBookingForm();

  return (
    <div className="container mx-auto my-4 bg-surface p-4 md:p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]">
      <h1 className="text-2xl font-bold text-text-primary text-center mb-3 uppercase">
        {t("pageTitle")}
      </h1>
      <BookingTabs value={serviceType} onChange={handleTabChange} />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <CustomerInfoSection />
        <VehicleInfoSection form={form} />
        <ServiceDetailSection />

        {serviceType === "pickup" && (
          <div className="flex flex-col gap-4">
            <PickupInfoSection />
            <PickupMapSection />
            <PickupCostSection />
          </div>
        )}
        <Form.Item
          label={
            <span className="font-semibold text-base">{t("form.note")}</span>
          }
          name="note"
        >
          <Input.TextArea
            rows={3}
            placeholder={t("form.notePlaceholder")}
            maxLength={500}
            showCount
            size="large"
          />
        </Form.Item>
        <Form.Item className="mt-6">
          <Button
            color="default"
            variant="solid"
            htmlType="submit"
            className="bg-primary-700 text-white font-bold text-base h-12 rounded-[var(--radius-lg)] hover:bg-primary-500 shadow-[var(--shadow-primary)]"
            size="large"
            loading={submitLoading}
          >
            {t("form.submitButton")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
