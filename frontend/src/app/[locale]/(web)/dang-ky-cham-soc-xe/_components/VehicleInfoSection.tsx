"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

import { TRANSLATION_FILES } from "@/lib/i18n";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModel } from "@/features/appointment/hooks/useVehicleModel";
import { useVehicleService } from "@/features/appointment/hooks/useVehicleService";
import VehicleModelModal from "./VehicleModelModal";
import ServiceSelectionModal from "./ServiceSelectionModal";

export default function VehicleInfoSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const { control, setValue, watch } = useFormContext();

  const [localSelectedBrand, setLocalSelectedBrand] = useState<
    string | undefined
  >(undefined);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  const { vehicleBrands } = useVehicleBrand();
  const { vehicleModels } = useVehicleModel();
  const { vehicleServices } = useVehicleService();

  // Compute display value for vehicle model
  const brandId = watch("vehicleBrand");
  const modelId = watch("vehicleModel");
  const brandName = brandId
    ? vehicleBrands.find((b) => b._id === brandId)?.name
    : "";
  const modelName = modelId
    ? vehicleModels.find((m) => m._id === modelId)?.name
    : "";
  const vehicleDisplayValue =
    brandName && modelName
      ? `${brandName} - ${modelName}`
      : modelName || "";

  // Watch selected services
  const selectedServices: string[] = watch("vehicleServices") || [];

  // Build display text for selected services
  const serviceDisplayValue =
    selectedServices.length === 0
      ? ""
      : selectedServices
          .map((id) => vehicleServices.find((s) => s._id === id)?.name)
          .filter(Boolean)
          .join(", ");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Model (click to open modal) */}
        <FormField
          control={control}
          name="vehicleModel"
          render={() => (
            <FormItem>
              <FormLabel>{t("vehicleModelModal.pickMotorbike")} <span className="text-red-500">*</span></FormLabel>
              <input
                readOnly
                value={vehicleDisplayValue}
                placeholder={t("form.vehicleModelPlaceholder")}
                onClick={() => setVehicleModalOpen(true)}
                className="flex h-11 w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-base text-text-primary shadow-[var(--shadow-inner)] outline-none placeholder:text-text-muted hover:border-border-strong cursor-pointer md:text-sm"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* License Plate */}
        <FormField
          control={control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.licensePlate")} <span className="text-red-500">*</span></FormLabel>
              <Input
                placeholder={t("form.licensePlatePlaceholder")}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Services — spans full width, below vehicle model on mobile */}
        <FormField
          control={control}
          name="vehicleServices"
          render={() => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t("form.vehicleService")} <span className="text-red-500">*</span></FormLabel>
              <input
                readOnly
                value={serviceDisplayValue}
                placeholder={
                  modelId
                    ? "Chọn gói dịch vụ..."
                    : "Vui lòng chọn dòng xe trước"
                }
                onClick={() => {
                  if (modelId) setServiceModalOpen(true);
                }}
                className={`flex h-11 w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-base text-text-primary shadow-[var(--shadow-inner)] outline-none placeholder:text-text-muted md:text-sm ${
                  modelId
                    ? "hover:border-border-strong cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
              />
              {selectedServices.length > 0 && (
                <p className="text-xs text-text-muted mt-1">
                  Đã chọn {selectedServices.length} dịch vụ
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Vehicle Model Modal */}
      <VehicleModelModal
        open={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSubmit={(vehicle) => {
          setValue("vehicleBrand", localSelectedBrand || "", {
            shouldValidate: true,
          });
          setValue("vehicleModel", vehicle.value, { shouldValidate: true });
          setVehicleModalOpen(false);
        }}
        localSelectedBrand={localSelectedBrand}
        setLocalSelectedBrand={setLocalSelectedBrand}
      />

      {/* Service Selection Modal */}
      <ServiceSelectionModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        selectedServices={selectedServices}
        onSubmit={(ids) => {
          setValue("vehicleServices", ids, { shouldValidate: true });
        }}
      />
    </>
  );
}
