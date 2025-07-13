import { Row, Col, Form, Select, Input } from "antd";
import { VehicleBrand } from "@/features/vehicle-brand/types";
import { ServiceCategory } from "@/features/service-category/types";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function VehicleInfoSection({
  brands,
  modelOptions,
  selectedBrand,
  onBrandChange,
  serviceCategories,
  loadingVehicleBrands,
  loadingVehicleModels,
  loadingServiceCategories,
}: {
  brands: VehicleBrand[];
  loadingVehicleBrands: boolean;
  loadingVehicleModels: boolean;
  modelOptions: { label: string; value: string }[];
  selectedBrand?: string;
  onBrandChange: (value: string) => void;
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
              {t("form.vehicleBrand")}
            </span>
          }
          name="vehicleBrand"
          rules={[{ required: true, message: t("form.vehicleBrandRequired") }]}
        >
          <Select
            placeholder={t("form.vehicleBrandPlaceholder")}
            options={brands.map((b) => ({ label: b.name, value: b._id }))}
            onChange={onBrandChange}
            allowClear
            size="large"
            loading={loadingVehicleBrands}
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
            disabled={!selectedBrand}
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
              {t("form.vehicleNumber")}
            </span>
          }
          name="vehicleNumber"
          rules={[{ required: true, message: t("form.vehicleNumberRequired") }]}
        >
          <Input
            placeholder={t("form.vehicleNumberPlaceholder")}
            size="large"
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">
              {t("form.serviceCategory")}
            </span>
          }
          name="serviceCategory"
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
