"use client";

import { Row, Col, Form, Select, Input, FormInstance } from "antd";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModelByBrand } from "@/features/appointment/hooks/useVehicleModelByBrand";
import { useEffect, useState } from "react";
import { useVehicleService } from "@/features/appointment/hooks/useVehicleService";

interface Props {
  form: FormInstance;
}

export default function VehicleInfoSection({ form }: Props) {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  const [localSelectedBrand, setLocalSelectedBrand] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const initialBrand = form.getFieldValue("vehicleBrand");
    if (initialBrand) {
      setLocalSelectedBrand(initialBrand);
    }
  }, [form]);

  const { loadingVehicleBrands, vehicleBrandOptions } = useVehicleBrand();
  const { loadingVehicleModels, vehicleModelOptions } =
    useVehicleModelByBrand(localSelectedBrand);
  const { loadingVehicleServices, vehicleServices } = useVehicleService();

  const handleBrandChange = (vehicleBrandId: string) => {
    setLocalSelectedBrand(vehicleBrandId);

    form.setFieldsValue({ vehicleBrand: vehicleBrandId });

    form.setFieldsValue({ vehicleModel: undefined });
  };

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
            options={vehicleBrandOptions}
            allowClear
            size="large"
            loading={loadingVehicleBrands}
            onChange={handleBrandChange}
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
            options={vehicleModelOptions}
            allowClear
            size="large"
            loading={loadingVehicleModels}
            disabled={!localSelectedBrand}
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
              {t("form.vehicleService")}
            </span>
          }
          name="vehicleServices"
          rules={[
            { required: true, message: t("form.vehicleServiceRequired") },
          ]}
        >
          <Select
            placeholder={t("form.vehicleServicePlaceholder")}
            options={vehicleServices.map((s) => ({
              label: s.name,
              value: s._id,
            }))}
            allowClear
            mode="multiple"
            size="large"
            loading={loadingVehicleServices}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
