"use client";

import { useTranslations } from "next-intl";

import BookingTabs from "./BookingTabs";
import CustomerInfoSection from "./CustomerInfoSection";
import VehicleInfoSection from "./VehicleInfoSection";
import ServiceDetailSection from "./ServiceDetailSection";
import PickupInfoSection from "./PickupInfoSection";
import PickupMapSection from "./PickupMapSection";
import PickupCostSection from "./PickupCostSection";
import ParticleBackground from "./ParticleBackground";
import { useBookingForm } from "../../../../../features/appointment/hooks/useBookingForm";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { Form } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";

export default function VehicleMaintenanceRegistration() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  const { form, serviceType, handleTabChange, handleFinish, submitLoading } =
    useBookingForm();

  return (
    <div className="relative min-h-[60vh]">
      <ParticleBackground />
      <div className="container relative z-10 mx-auto my-6 max-w-4xl px-4">
      <h1 className="text-2xl font-bold text-text-primary text-center mb-6 uppercase">
        {t("pageTitle")}
      </h1>

      <BookingTabs value={serviceType} onChange={handleTabChange} />

      <div className="bg-surface p-6 md:p-10 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] border border-border">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFinish)}
            className="space-y-6"
          >
            {/* Section: Customer Info */}
            <fieldset>
              <legend className="text-base font-bold text-text-primary mb-4">
                Thông tin khách hàng
              </legend>
              <CustomerInfoSection />
            </fieldset>

            {/* Section: Vehicle Info */}
            <fieldset>
              <legend className="text-base font-bold text-text-primary mb-4">
                Thông tin xe
              </legend>
              <VehicleInfoSection />
            </fieldset>

            {/* Section: Schedule */}
            <fieldset>
              <legend className="text-base font-bold text-text-primary mb-4">
                Lịch hẹn
              </legend>
              <ServiceDetailSection />
            </fieldset>

            {/* Pickup sections */}
            {serviceType === "pickup" && (
              <fieldset>
                <legend className="text-base font-bold text-text-primary mb-4">
                  Nhận xe tại nhà
                </legend>
                <div className="space-y-4">
                  <PickupInfoSection />
                  <PickupMapSection />
                  <PickupCostSection />
                </div>
              </fieldset>
            )}

            {/* Note */}
            <div>
              <label
                htmlFor="note"
                className="text-sm font-medium text-text-primary mb-1.5 block"
              >
                {t("form.note")}
              </label>
              <textarea
                id="note"
                rows={3}
                placeholder={t("form.notePlaceholder")}
                maxLength={500}
                {...form.register("note")}
                className="w-full px-4 py-3 border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 bg-surface text-text-primary transition-all duration-150 resize-y text-sm"
              />
              <p className="text-xs text-text-muted text-right mt-1">
                {form.watch("note")?.length || 0} / 500
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitLoading}
              >
                {submitLoading ? "Đang xử lý..." : t("form.submitButton")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      </div>
    </div>
  );
}
