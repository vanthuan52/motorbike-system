import { useTranslations } from "next-intl";

import { TRANSLATION_FILES } from "@/lib/i18n";

export default function PickupCostSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  return (
    <div className="rounded-[var(--radius-md)] border border-warning/30 bg-warning/5 p-4">
      <h4 className="text-sm font-bold text-warning mb-2">
        {t("pickupCost.title")}
      </h4>
      <ul className="text-sm text-text-primary pl-5 list-disc space-y-1.5">
        <li>{t("pickupCost.free")}</li>
        <li>{t("pickupCost.inWorkHour")}</li>
        <li>{t("pickupCost.outOfWorkHour")}</li>
      </ul>
    </div>
  );
}
