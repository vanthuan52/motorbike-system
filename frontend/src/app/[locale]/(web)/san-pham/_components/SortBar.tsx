"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { TRANSLATION_FILES } from "@/lib/i18n";

type SortValue = "relevance" | "discount" | "newest" | "price-asc" | "price-desc";

interface Props {
  sort: SortValue;
  onChange: (sort: SortValue) => void;
  total: number;
  showing: number;
  layout: "grid" | "list";
  onLayoutChange: (layout: "grid" | "list") => void;
  onFilterOpen: () => void;
}

export default function SortBar({
  sort,
  onChange,
  layout,
  onLayoutChange,
  onFilterOpen,
}: Props) {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT);
  const [priceOpen, setPriceOpen] = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);

  const isPrice = sort === "price-asc" || sort === "price-desc";

  // Close price dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) {
        setPriceOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const tabClass = (active: boolean) =>
    `py-1.5 text-base font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap
     ${active ? "text-primary-500" : "text-text-secondary hover:text-text-primary"}`;

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Sort tabs */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange("discount")}
          className={tabClass(sort === "discount")}
        >
          {t("sortBar.options.discount")}
        </button>

        <button
          type="button"
          onClick={() => onChange("newest")}
          className={tabClass(sort === "newest")}
        >
          {t("sortBar.options.newest")}
        </button>

        {/* Price dropdown tab */}
        <div ref={priceRef} className="relative">
          <button
            type="button"
            onClick={() => setPriceOpen((prev) => !prev)}
            className={`${tabClass(isPrice)} inline-flex items-center gap-1`}
          >
            {t("sortBar.options.price")}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${priceOpen ? "rotate-180" : ""}`}
            />
          </button>

          {priceOpen && (
            <div className="absolute top-full left-0 mt-1 z-20 min-w-[160px]
                            bg-surface rounded-lg shadow-md border border-border py-1">
              <button
                type="button"
                onClick={() => { onChange("price-asc"); setPriceOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors
                  ${sort === "price-asc"
                    ? "text-primary-500 bg-primary-50 font-medium"
                    : "text-text-secondary hover:bg-bg-hover"}`}
              >
                {t("sortBar.options.priceAsc")}
              </button>
              <button
                type="button"
                onClick={() => { onChange("price-desc"); setPriceOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors
                  ${sort === "price-desc"
                    ? "text-primary-500 bg-primary-50 font-medium"
                    : "text-text-secondary hover:bg-bg-hover"}`}
              >
                {t("sortBar.options.priceDesc")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Layout toggle + Filter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-secondary-100 rounded-md">
          <button
            className={`p-1.5 cursor-pointer rounded-md transition-colors duration-200
              ${layout === "grid" ? "bg-primary-500" : ""}`}
            onClick={() => onLayoutChange("grid")}
            aria-label={t("sortBar.grid")}
            type="button"
          >
            <LayoutGrid
              size={20}
              className={layout === "grid" ? "text-white" : "text-text-secondary"}
            />
          </button>
          <button
            className={`p-1.5 cursor-pointer rounded-md transition-colors duration-200
              ${layout === "list" ? "bg-primary-500" : ""}`}
            onClick={() => onLayoutChange("list")}
            aria-label={t("sortBar.list")}
            type="button"
          >
            <List
              size={20}
              className={layout === "list" ? "text-white" : "text-text-secondary"}
            />
          </button>
        </div>

        {/* Filter button — visible only below lg */}
        <button
          type="button"
          onClick={onFilterOpen}
          className="lg:hidden p-1.5 rounded-md border border-border bg-surface
                     text-text-secondary hover:bg-bg-hover transition-colors duration-200"
          aria-label={t("filter.open")}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
