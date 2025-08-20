"use client";

import { Row, Col, Form, Select, Input, FormInstance } from "antd";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { useVehicleService } from "@/features/appointment/hooks/useVehicleService";
import VehicleModelModal from "./VehicleModelModal";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModel } from "@/features/appointment/hooks/useVehicleModel";

interface Props {
  form: FormInstance;
}

export default function VehicleInfoSection({ form }: Props) {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  const [localSelectedBrand, setLocalSelectedBrand] = useState<
    string | undefined
  >(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const initialBrand = form.getFieldValue("vehicleBrand");
    if (initialBrand) {
      setLocalSelectedBrand(initialBrand);
    }
  }, [form]);

  const { loadingVehicleBrands, vehicleBrands } = useVehicleBrand();
  const { vehicleModels } = useVehicleModel();
  const { loadingVehicleServices, vehicleServices } = useVehicleService();

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={
              <span className="font-semibold text-base">
                {t("vehicleModelModal.pickMotorbike")}
              </span>
            }
            name="vehicleModel"
            rules={[
              { required: true, message: t("form.vehicleModelRequired") },
            ]}
          >
            <div>
              <Input
                readOnly
                value={(() => {
                  const brandId = form.getFieldValue("vehicleBrand");
                  const modelId = form.getFieldValue("vehicleModel");

                  const brand =
                    brandId &&
                    vehicleBrands.find((b) => b._id === brandId)?.name;
                  const model =
                    modelId &&
                    vehicleModels.find((m) => m._id === modelId)?.name;

                  if (brand && model) return `${brand} - ${model}`;
                  if (model) return model;
                })()}
                placeholder={t("form.vehicleModelPlaceholder")}
                onClick={() => setModalOpen(true)}
                size="large"
              />
            </div>
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
            rules={[
              { required: true, message: t("form.licensePlateRequired") },
            ]}
          >
            <Input
              placeholder={t("form.licensePlatePlaceholder")}
              size="large"
            />
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
      <VehicleModelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(vehicle) => {
          form.setFieldsValue({
            vehicleBrand: localSelectedBrand,
            vehicleModel: vehicle.value,
          });
          setModalOpen(false);
        }}
        localSelectedBrand={localSelectedBrand}
        setLocalSelectedBrand={setLocalSelectedBrand}
      />
    </>
  );
}
