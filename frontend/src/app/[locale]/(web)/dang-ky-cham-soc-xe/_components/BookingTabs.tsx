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
    <div className="flex gap-1 mb-6 bg-secondary-100 rounded-[var(--radius-md)] p-1">
      {tabs.map((tab) => {
        const isActive = value === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={clsx(
              "flex-1 px-4 py-2.5 text-sm md:text-base rounded-[var(--radius-sm)] font-semibold cursor-pointer transition-all duration-200",
              isActive
                ? "bg-surface text-text-primary shadow-[var(--shadow-sm)]"
                : "bg-transparent text-text-muted hover:text-text-secondary"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
