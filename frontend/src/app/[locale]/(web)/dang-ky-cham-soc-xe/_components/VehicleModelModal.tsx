"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import Image from "next/image";

import { TRANSLATION_FILES } from "@/lib/i18n";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModelByBrand } from "@/features/appointment/hooks/useVehicleModelByBrand";
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_TYPE,
} from "@/features/vehicle-model/types";

interface VehicleModel {
  value: string;
  label: string;
  year?: number;
  displacement?: number;
  image?: string;
}

interface VehicleModelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vehicle: VehicleModel) => void;
  localSelectedBrand: string | undefined;
  setLocalSelectedBrand: (brand: string) => void;
}

export default function VehicleModelModal({
  open,
  onClose,
  onSubmit,
  localSelectedBrand,
  setLocalSelectedBrand,
}: VehicleModelModalProps) {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const [filters, setFilters] = useState<{
    search?: string;
    displacement?: number;
    year?: number;
    fuelType?: ENUM_VEHICLE_MODEL_FUEL_TYPE;
    type?: ENUM_VEHICLE_MODEL_TYPE;
  }>({});
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

  const { loadingVehicleBrands: loadingBrands, vehicleBrandOptions: brands } =
    useVehicleBrand();

  const memoizedFilters = useMemo(() => filters, [filters]);
  const { loadingVehicleModels: loadingModels, vehicleModelOptions: models } =
    useVehicleModelByBrand(localSelectedBrand, memoizedFilters);

  const filteredModels = useMemo(() => {
    let data = [...models];
    if (filters.search) {
      data = data.filter((m) =>
        m.label.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    return data;
  }, [models, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleSubmit = () => {
    if (selectedModel) {
      onSubmit(selectedModel);
    }
  };

  const paginatedModels = filteredModels.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredModels.length / pageSize);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-secondary-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-[1000px] max-h-[90vh] overflow-y-auto bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] border border-border">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-lg font-bold text-text-primary">
            {t("vehicleModelModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-9 rounded-full hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Brand Select */}
          <select
            value={localSelectedBrand || ""}
            onChange={(e) => setLocalSelectedBrand(e.target.value)}
            className="w-full min-h-[44px] py-3 px-4 rounded-[var(--radius-md)] text-base border border-border bg-surface text-text-primary appearance-none shadow-[var(--shadow-inner)] outline-none focus:border-primary-500 focus:shadow-[var(--shadow-focus-ring)] focus:border-2 hover:border-border-strong"
          >
            <option value="" disabled>
              {t("vehicleModelModal.pickMotorbike")}
            </option>
            {brands.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>

          {/* Filters */}
          {localSelectedBrand && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                placeholder={t("vehicleModelModal.filter.search")}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
              />
              <select
                className="w-full min-h-[44px] py-3 px-4 rounded-[var(--radius-md)] text-sm border border-border bg-surface text-text-primary appearance-none outline-none focus:border-primary-500 focus:border-2 hover:border-border-strong"
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    displacement: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
                defaultValue=""
              >
                <option value="">
                  {t("vehicleModelModal.filter.displacement")}
                </option>
                <option value="150">150cc</option>
                <option value="155">155cc</option>
                <option value="300">300cc</option>
                <option value="350">350cc</option>
              </select>
              <select
                className="w-full min-h-[44px] py-3 px-4 rounded-[var(--radius-md)] text-sm border border-border bg-surface text-text-primary appearance-none outline-none focus:border-primary-500 focus:border-2 hover:border-border-strong"
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    fuelType: e.target.value
                      ? (e.target.value as ENUM_VEHICLE_MODEL_FUEL_TYPE)
                      : undefined,
                  }))
                }
                defaultValue=""
              >
                <option value="">
                  {t("vehicleModelModal.filter.fuelType")}
                </option>
                <option value={ENUM_VEHICLE_MODEL_FUEL_TYPE.GASOLINE}>
                  {t("vehicleModelModal.filter.gasoline")}
                </option>
                <option value={ENUM_VEHICLE_MODEL_FUEL_TYPE.HYBRID}>
                  {t("vehicleModelModal.filter.hybrid")}
                </option>
                <option value={ENUM_VEHICLE_MODEL_FUEL_TYPE.ELECTRIC}>
                  {t("vehicleModelModal.filter.electric")}
                </option>
              </select>
              <select
                className="w-full min-h-[44px] py-3 px-4 rounded-[var(--radius-md)] text-sm border border-border bg-surface text-text-primary appearance-none outline-none focus:border-primary-500 focus:border-2 hover:border-border-strong"
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    type: e.target.value
                      ? (e.target.value as ENUM_VEHICLE_MODEL_TYPE)
                      : undefined,
                  }))
                }
                defaultValue=""
              >
                <option value="">{t("vehicleModelModal.filter.type")}</option>
                <option value={ENUM_VEHICLE_MODEL_TYPE.SCOOTER}>
                  {t("vehicleModelModal.filter.scooter")}
                </option>
                <option value={ENUM_VEHICLE_MODEL_TYPE.MANUAL}>
                  {t("vehicleModelModal.filter.manual")}
                </option>
                <option value={ENUM_VEHICLE_MODEL_TYPE.CLUTCH}>
                  {t("vehicleModelModal.filter.clutch")}
                </option>
                <option value={ENUM_VEHICLE_MODEL_TYPE.ELECTRIC}>
                  {t("vehicleModelModal.filter.electricBike")}
                </option>
              </select>
            </div>
          )}

          {/* Model Grid */}
          <div className="min-h-[250px]">
            {!localSelectedBrand ? (
              <div className="flex justify-center items-center h-40 text-text-muted text-sm">
                {t("vehicleModelModal.noBrandSelected")}
              </div>
            ) : loadingModels ? (
              <div className="flex justify-center items-center h-40 text-text-muted text-sm">
                {t("vehicleModelModal.loading")}
              </div>
            ) : paginatedModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src="/images/motorbike-not-found.png"
                  alt="Not found"
                  className="w-32 h-32 object-contain mb-2 opacity-60"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedModels.map((m) => (
                  <div
                    key={m.value}
                    onClick={() =>
                      setSelectedModel((prev) =>
                        prev?.value === m.value ? null : m
                      )
                    }
                    className={`cursor-pointer rounded-[var(--radius-md)] border-2 overflow-hidden transition-all duration-150 hover:shadow-[var(--shadow-sm)] ${
                      selectedModel?.value === m.value
                        ? "border-primary-500 shadow-[var(--shadow-sm)]"
                        : "border-border"
                    }`}
                  >
                    <div className="relative h-36 bg-secondary-100">
                      <img
                        src={m.image || "/images/image-holder-icon.png"}
                        alt={m.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-3 py-2.5">
                      <h3 className="font-semibold text-sm text-text-primary">
                        {m.label}
                      </h3>
                      {m.year && (
                        <p className="text-xs text-text-muted">
                          {t("vehicleModelModal.filter.year")}: {m.year}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-border rounded-[var(--radius-md)] disabled:opacity-40 hover:bg-surface-alt cursor-pointer transition-colors"
              >
                ←
              </button>
              <span className="text-sm text-text-secondary">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-border rounded-[var(--radius-md)] disabled:opacity-40 hover:bg-surface-alt cursor-pointer transition-colors"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-surface">
          <Button variant="outline" onClick={onClose}>
            {t("vehicleModelModal.cancelButton")}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedModel}>
            {t("vehicleModelModal.confirmButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
