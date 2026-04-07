"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

import { TRANSLATION_FILES } from "@/lib/i18n";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useVehicleService } from "@/features/appointment/hooks/useVehicleService";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModel } from "@/features/appointment/hooks/useVehicleModel";
import VehicleModelModal from "./VehicleModelModal";

export default function VehicleInfoSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const { control, setValue, watch } = useFormContext();

  const [localSelectedBrand, setLocalSelectedBrand] = useState<
    string | undefined
  >(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const { vehicleBrands } = useVehicleBrand();
  const { vehicleModels } = useVehicleModel();
  const { loadingVehicleServices, vehicleServices } = useVehicleService();

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

  // Watch selected services for checkbox state
  const selectedServices: string[] = watch("vehicleServices") || [];

  const handleServiceToggle = (serviceId: string) => {
    const current = [...selectedServices];
    const idx = current.indexOf(serviceId);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(serviceId);
    }
    setValue("vehicleServices", current, { shouldValidate: true });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Model (click to open modal) */}
        <FormField
          control={control}
          name="vehicleModel"
          render={() => (
            <FormItem>
              <FormLabel>{t("vehicleModelModal.pickMotorbike")}</FormLabel>
              <input
                readOnly
                value={vehicleDisplayValue}
                placeholder={t("form.vehicleModelPlaceholder")}
                onClick={() => setModalOpen(true)}
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
              <FormLabel>{t("form.licensePlate")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("form.licensePlatePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Vehicle Services - Checkbox list */}
      <FormField
        control={control}
        name="vehicleServices"
        render={() => (
          <FormItem className="mt-4">
            <FormLabel>{t("form.vehicleService")}</FormLabel>
            {loadingVehicleServices ? (
              <p className="text-sm text-text-muted py-2">
                Đang tải dịch vụ...
              </p>
            ) : vehicleServices.length === 0 ? (
              <p className="text-sm text-text-muted py-2 italic">
                Chưa có dịch vụ nào.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {vehicleServices.map((service) => {
                  const isChecked = selectedServices.includes(service._id);
                  return (
                    <label
                      key={service._id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border cursor-pointer transition-all duration-150 ${
                        isChecked
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-border bg-surface hover:border-border-strong hover:bg-surface-alt"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleServiceToggle(service._id)}
                        className="accent-primary-500 size-4 shrink-0"
                      />
                      <span className="text-sm font-medium">
                        {service.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <VehicleModelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(vehicle) => {
          setValue("vehicleBrand", localSelectedBrand || "", {
            shouldValidate: true,
          });
          setValue("vehicleModel", vehicle.value, { shouldValidate: true });
          setModalOpen(false);
        }}
        localSelectedBrand={localSelectedBrand}
        setLocalSelectedBrand={setLocalSelectedBrand}
      />
    </>
  );
}
