import { Card, Typography } from "antd";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

const { Title } = Typography;

export default function PickupCostSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  return (
    <Card className="mb-4 bg-gray-100 border border-gray-300">
      <Title level={5} className="text-yellow-500 mb-2">
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
