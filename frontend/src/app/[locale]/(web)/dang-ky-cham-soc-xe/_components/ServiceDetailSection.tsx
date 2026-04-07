import { Row, Col, Form, DatePicker, TimePicker } from "antd";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function ServiceDetailSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">{t("form.date")}</span>
          }
          name="date"
          rules={[{ required: true, message: t("form.dateRequired") }]}
        >
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            placeholder={t("form.datePlaceholder")}
            size="large"
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">
              {t("form.timeSlot")}
            </span>
          }
          name="time"
          rules={[{ required: true, message: t("form.timeSlotRequired") }]}
          extra={
            <span className="text-xs text-text-muted">
              {t("form.timeSlotExtra")}
            </span>
          }
        >
          <TimePicker
            className="w-full"
            format="HH:mm"
            placeholder={t("form.timeSlotPlaceholder")}
            size="large"
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
