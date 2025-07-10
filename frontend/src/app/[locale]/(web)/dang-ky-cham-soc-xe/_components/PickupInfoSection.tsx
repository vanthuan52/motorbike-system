import { TRANSLATION_FILES } from "@/lib/i18n";
import { Form, Input } from "antd";
import { useTranslations } from "next-intl";

export default function PickupInfoSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  return (
    <Form.Item
      label={
        <span className="font-semibold text-base">{t("form.address")}</span>
      }
      name="address"
      rules={[{ required: true, message: t("form.addressRequired") }]}
    >
      <Input placeholder={t("form.addressPlaceholder")} size="large" />
    </Form.Item>
  );
}
