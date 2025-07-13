import { Row, Col, Form, Select, Input } from "antd";
import { ServiceCategory } from "@/features/service-category/types";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function VehicleInfoSection({
  modelOptions,
  serviceCategories,
  loadingVehicleModels,
  loadingServiceCategories,
}: {
  loadingVehicleModels: boolean;
  modelOptions: { label: string; value: string }[];
  serviceCategories: ServiceCategory[];
  loadingServiceCategories: boolean;
}) {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">
              {t("form.userVehicle")}
            </span>
          }
          name="userVehicle"
          // rules={[{ required: true, message: t("form.userVehicleRequired") }]}
        >
          <Select
            placeholder={t("form.userVehiclePlaceholder")}
            // options={brands.map((b) => ({ label: b.name, value: b._id }))}
            // onChange={onBrandChange}
            allowClear
            size="large"
            // loading={loadingVehicleBrands}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">
              {t("form.vehicleModel")}
            </span>
          }
          name="vehicleModel"
          rules={[{ required: true, message: t("form.vehicleModelRequired") }]}
        >
          <Select
            placeholder={t("form.vehicleModelPlaceholder")}
            options={modelOptions}
            allowClear
            size="large"
            loading={loadingVehicleModels}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">
              {t("form.licensePlate")}
            </span>
          }
          name="licensePlate"
          rules={[{ required: true, message: t("form.licensePlateRequired") }]}
        >
          <Input placeholder={t("form.licensePlatePlaceholder")} size="large" />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">
              {t("form.serviceCategory")}
            </span>
          }
          name="vehicleServices"
          rules={[
            { required: true, message: t("form.serviceCategoryRequired") },
          ]}
        >
          <Select
            placeholder={t("form.serviceCategoryPlaceholder")}
            options={serviceCategories.map((s) => ({
              label: s.name,
              value: s._id,
            }))}
            allowClear
            mode="multiple"
            size="large"
            loading={loadingServiceCategories}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
