"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X, Search, Wrench, Check } from "lucide-react";

import { TRANSLATION_FILES } from "@/lib/i18n";
import { useVehicleService } from "@/features/appointment/hooks/useVehicleService";

interface ServiceSelectionModalProps {
  open: boolean;
  onClose: () => void;
  selectedServices: string[];
  onSubmit: (serviceIds: string[]) => void;
}

export default function ServiceSelectionModal({
  open,
  onClose,
  selectedServices,
  onSubmit,
}: ServiceSelectionModalProps) {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const { loadingVehicleServices, vehicleServices } = useVehicleService();
  const [localSelected, setLocalSelected] = useState<string[]>(selectedServices);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Derive categories from services
  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    vehicleServices.forEach((s) => {
      if (s.serviceCategory) {
        cats.set(s.serviceCategory._id, s.serviceCategory.name);
      }
    });
    return [
      { id: "all", name: "Tất cả" },
      ...Array.from(cats.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [vehicleServices]);

  const filteredServices = useMemo(() => {
    let result = vehicleServices;

    if (activeCategory !== "all") {
      result = result.filter(
        (s) => s.serviceCategory?._id === activeCategory
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }

    return result;
  }, [vehicleServices, activeCategory, search]);

  // Calculate total price of selected services
  const totalPrice = useMemo(() => {
    return vehicleServices
      .filter((s) => localSelected.includes(s._id))
      .reduce((sum, s) => sum + (s.basePrice || 0), 0);
  }, [vehicleServices, localSelected]);

  const toggleService = (id: string) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(localSelected);
    onClose();
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
      <div className="relative z-10 w-full max-w-[700px] max-h-[85vh] flex flex-col bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Wrench size={18} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {t("form.vehicleService")}
              </h2>
              <p className="text-xs text-text-muted">
                Chọn các dịch vụ bạn cần
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
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer
                  ${
                    activeCategory === cat.id
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-bg-soft border border-border text-text-secondary hover:border-primary-300"
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm dịch vụ..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-bg-soft text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          {/* Services list */}
          <div className="space-y-2">
            {loadingVehicleServices ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-secondary-100 rounded-xl animate-pulse" />
              ))
            ) : filteredServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search size={28} className="text-text-muted mb-2" />
                <p className="text-sm text-text-muted">Không tìm thấy dịch vụ</p>
              </div>
            ) : (
              filteredServices.map((service) => {
                const isChecked = localSelected.includes(service._id);
                return (
                  <button
                    key={service._id}
                    type="button"
                    onClick={() => toggleService(service._id)}
                    className={`
                      w-full flex items-center gap-3.5 p-4 rounded-xl border-2 text-left transition-all cursor-pointer
                      ${
                        isChecked
                          ? "border-primary-500 bg-primary-50/50"
                          : "border-border bg-surface hover:border-primary-200 hover:bg-bg-soft"
                      }
                    `}
                  >
                    {/* Checkbox */}
                    <div
                      className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${
                          isChecked
                            ? "bg-primary-500 border-primary-500"
                            : "border-border-strong bg-surface"
                        }
                      `}
                    >
                      {isChecked && <Check size={12} className="text-white" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">
                        {service.name}
                      </p>
                      {service.description && (
                        <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                          {service.description}
                        </p>
                      )}
                    </div>

                    {/* Price + Category */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {service.basePrice != null && (
                        <span className="text-sm font-bold text-primary-500">
                          {service.basePrice.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                      {service.serviceCategory && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-soft text-text-muted whitespace-nowrap">
                          {service.serviceCategory.name}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-surface">
          <div>
            <p className="text-xs text-text-muted">
              Đã chọn{" "}
              <span className="font-bold text-primary-500">
                {localSelected.length}
              </span>{" "}
              dịch vụ
            </p>
            {totalPrice > 0 && (
              <p className="text-sm font-bold text-text-primary">
                Tổng: {totalPrice.toLocaleString("vi-VN")}₫
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-bg-soft cursor-pointer transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={localSelected.length === 0}
              className="h-10 px-5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
            >
              Xác nhận ({localSelected.length})
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
