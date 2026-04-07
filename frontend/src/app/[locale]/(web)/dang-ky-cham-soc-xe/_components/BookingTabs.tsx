import React from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

type BookingTabsProps = {
  value: string;
  onChange: (key: string) => void;
};

export default function BookingTabs({ value, onChange }: BookingTabsProps) {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  const tabs = [
    { key: "store", label: t("tabs.store") },
    { key: "pickup", label: t("tabs.pickup") },
  ];
  return (
    <div className="flex bg-surface-alt rounded-[var(--radius-lg)] p-1 mb-6 border border-border">
      {tabs.map((tab) => {
        const isActive = value === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={clsx(
              "flex-1 px-4 py-2 text-sm md:text-base rounded-[var(--radius-md)] font-medium transition-all duration-200 mx-1 cursor-pointer",
              isActive
                ? "bg-primary-700 text-white shadow-[var(--shadow-primary)]"
                : "bg-surface text-text-secondary hover:bg-secondary-100 border border-border"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
