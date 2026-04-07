import { Card, Typography } from "antd";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

const { Title } = Typography;

export default function PickupCostSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  return (
    <Card className="mb-4 bg-surface-alt border border-border">
      <Title level={5} className="text-warning mb-2">
        {t("pickupCost.title")}
      </Title>
      <ul className="text-black text-sm pl-4 list-disc space-y-2">
        <li>{t("pickupCost.free")}</li>
        <li>{t("pickupCost.inWorkHour")}</li>
        <li>{t("pickupCost.outOfWorkHour")}</li>
      </ul>
    </Card>
  );
}
