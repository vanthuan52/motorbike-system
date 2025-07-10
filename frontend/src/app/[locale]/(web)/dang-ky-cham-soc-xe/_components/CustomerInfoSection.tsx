import { TRANSLATION_FILES } from "@/lib/i18n";
import { Row, Col, Form, Input } from "antd";
import { useTranslations } from "next-intl";

export default function CustomerInfoSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">{t("form.name")}</span>
          }
          name="customer"
          rules={[{ required: true, message: t("form.nameRequired") }]}
        >
          <Input placeholder={t("form.namePlaceholder")} size="large" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">{t("form.phone")}</span>
          }
          name="phone"
          rules={[
            { required: true, message: t("form.phoneRequired") },
            { pattern: /^0\d{9}$/, message: t("form.phoneInvalid") },
          ]}
        >
          <Input placeholder={t("form.phonePlaceholder")} size="large" />
        </Form.Item>
      </Col>
    </Row>
  );
}
