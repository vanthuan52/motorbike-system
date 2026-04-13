"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X, Search, Bike, ChevronLeft, ChevronRight, Check } from "lucide-react";

import { TRANSLATION_FILES } from "@/lib/i18n";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModelByBrand } from "@/features/appointment/hooks/useVehicleModelByBrand";
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_TYPE,
} from "@/features/vehicle-model/types";

interface VehicleModelOption {
  value: string;
  label: string;
  year?: number;
  displacement?: number;
  image?: string;
}

interface VehicleModelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vehicle: VehicleModelOption) => void;
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
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState<VehicleModelOption | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { loadingVehicleBrands, vehicleBrandOptions: brands } = useVehicleBrand();
  const filters = useMemo(() => ({ search: "" }), []);
  const { loadingVehicleModels, vehicleModelOptions: models } =
    useVehicleModelByBrand(localSelectedBrand, filters);

  const filteredModels = useMemo(() => {
    if (!search) return models;
    const q = search.toLowerCase();
    return models.filter((m) => m.label.toLowerCase().includes(q));
  }, [models, search]);

  useEffect(() => setPage(1), [search, localSelectedBrand]);

  const totalPages = Math.ceil(filteredModels.length / pageSize);
  const paginatedModels = filteredModels.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSubmit = () => {
    if (selectedModel) onSubmit(selectedModel);
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-secondary-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[900px] max-h-[85vh] flex flex-col bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <Bike size={18} className="text-primary-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {t("vehicleModelModal.title")}
              </h2>
              <p className="text-xs text-text-muted">
                Chọn hãng xe và dòng xe của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-bg-soft transition-colors cursor-pointer"
          >
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Brand pills */}
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">
              Hãng xe
            </label>
            {loadingVehicleBrands ? (
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-24 bg-secondary-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => {
                      setLocalSelectedBrand(b.value);
                      setSelectedModel(null);
                    }}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                      ${
                        localSelectedBrand === b.value
                          ? "bg-primary-500 text-white shadow-sm"
                          : "bg-bg-soft border border-border text-text-secondary hover:border-primary-300 hover:text-primary-500"
                      }
                    `}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          {localSelectedBrand && (
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("vehicleModelModal.filter.search")}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-bg-soft text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
          )}

          {/* Model Grid */}
          <div className="min-h-[240px]">
            {!localSelectedBrand ? (
              <div className="flex flex-col items-center justify-center h-52 text-center">
                <div className="w-16 h-16 rounded-2xl bg-bg-soft flex items-center justify-center mb-3">
                  <Bike size={28} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">
                  {t("vehicleModelModal.noBrandSelected")}
                </p>
              </div>
            ) : loadingVehicleModels ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-secondary-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : paginatedModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 text-center">
                <Search size={28} className="text-text-muted mb-2" />
                <p className="text-sm text-text-muted">Không tìm thấy dòng xe</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {paginatedModels.map((m) => {
                  const isSelected = selectedModel?.value === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() =>
                        setSelectedModel(isSelected ? null : m)
                      }
                      className={`
                        relative flex flex-col rounded-xl border-2 text-left transition-all cursor-pointer overflow-hidden
                        ${
                          isSelected
                            ? "border-primary-500 bg-primary-50/50 shadow-sm"
                            : "border-border bg-surface hover:border-primary-200 hover:bg-bg-soft"
                        }
                      `}
                    >
                      {/* Checkmark */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}

                      {/* Image */}
                      <div className="w-full h-32 bg-bg-soft flex items-center justify-center overflow-hidden">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.label}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Bike size={36} className="text-text-muted" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="px-3 py-2.5">
                        <p className="text-sm font-semibold text-text-primary line-clamp-1">
                          {m.label}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {m.year && (
                            <span className="text-xs text-text-muted">{m.year}</span>
                          )}
                          {m.displacement && m.displacement > 0 && (
                            <span className="text-xs text-text-muted">
                              {m.displacement}cc
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center disabled:opacity-30 hover:bg-bg-soft cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-text-secondary min-w-[60px] text-center">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center disabled:opacity-30 hover:bg-bg-soft cursor-pointer transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-surface">
          <p className="text-xs text-text-muted">
            {selectedModel ? (
              <>
                Đã chọn:{" "}
                <span className="font-semibold text-primary-500">
                  {selectedModel.label}
                </span>
              </>
            ) : (
              "Chọn một dòng xe để tiếp tục"
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-bg-soft cursor-pointer transition-colors"
            >
              {t("vehicleModelModal.cancelButton")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedModel}
              className="h-10 px-5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
            >
              {t("vehicleModelModal.confirmButton")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
