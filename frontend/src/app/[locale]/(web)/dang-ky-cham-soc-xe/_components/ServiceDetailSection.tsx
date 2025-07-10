import { TRANSLATION_FILES } from "@/lib/i18n";
import { Row, Col, Form, Select, DatePicker } from "antd";
import { useTranslations } from "next-intl";

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
];

export default function ServiceDetailSection() {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">{t("form.date")}</span>
          }
          name="scheduleDate"
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
          name="timeSlot"
          rules={[{ required: true, message: t("form.timeSlotRequired") }]}
        >
          <Select placeholder={t("form.timeSlotPlaceholder")} size="large">
            {timeSlots.map((slot) => (
              <Select.Option key={slot} value={slot}>
                {slot}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
}
