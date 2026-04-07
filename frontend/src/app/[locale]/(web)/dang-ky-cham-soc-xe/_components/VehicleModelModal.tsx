import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Select,
  Input,
  Button,
  Row,
  Col,
  Card,
  Pagination,
  Empty,
  Image,
} from "antd";
import { useTranslations } from "next-intl";
import { CloseOutlined } from "@ant-design/icons";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModelByBrand } from "@/features/appointment/hooks/useVehicleModelByBrand";
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_TYPE,
} from "@/features/vehicle-model/types";
import { TRANSLATION_FILES } from "@/lib/i18n";

interface VehicleModel {
  value: string;
  label: string;
  year?: number;
  displacement?: number;
  image?: string;
}

interface VehicleModelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vehicle: VehicleModel) => void;
  localSelectedBrand: string | undefined;
  setLocalSelectedBrand: (brand: string) => void;
}

export default function VehicleModelModal({
  open,
  onClose,
  onSubmit,
  localSelectedBrand,
  setLocalSelectedBrand,
}: VehicleModelModalProps) {
  const t = useTranslations(TRANSLATION_FILES.CARE_REGISTRATION);
  const [filters, setFilters] = useState<{
    search?: string;
    displacement?: number;
    year?: number;
    fuelType?: ENUM_VEHICLE_MODEL_FUEL_TYPE;
    type?: ENUM_VEHICLE_MODEL_TYPE;
  }>({});
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

  const { loadingVehicleBrands: loadingBrands, vehicleBrandOptions: brands } =
    useVehicleBrand();

  const memoizedFilters = useMemo(() => filters, [filters]);
  const { loadingVehicleModels: loadingModels, vehicleModelOptions: models } =
    useVehicleModelByBrand(localSelectedBrand, memoizedFilters);

  const filteredModels = useMemo(() => {
    let data = [...models];

    if (filters.search) {
      data = data.filter((m) =>
        m.label.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    if (filters.displacement) {
      data = data.filter((m) => m.value.includes(String(filters.displacement)));
    }
    if (filters.year) {
      data = data.filter((m) => m.value === String(filters.year));
    }
    if (filters.fuelType) {
      data = data.filter((m) => m.value === filters.fuelType);
    }
    if (filters.type) {
      data = data.filter((m) => m.value === filters.type);
    }

    return data;
  }, [models, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleSubmit = () => {
    if (selectedModel) {
      onSubmit(selectedModel);
    }
  };

  const paginatedModels = filteredModels.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width="90%"
      style={{ maxWidth: "1200px" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {t("vehicleModelModal.title")}
        </h2>
        <Button icon={<CloseOutlined />} type="text" onClick={onClose} />
      </div>

      <div className="mb-4">
        <Select
          placeholder={t("vehicleModelModal.pickMotorbike")}
          options={brands}
          onChange={(val) => setLocalSelectedBrand(val)}
          loading={loadingBrands}
          allowClear
          className="w-full"
          size="large"
        />
      </div>

      {localSelectedBrand && (
        <Row gutter={12} className="mb-4">
          <Col xs={24} flex="1">
            <Input
              placeholder={t("vehicleModelModal.filter.search")}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              size="large"
            />
          </Col>
          <Col xs={24} flex="1">
            <Select
              placeholder={t("vehicleModelModal.filter.displacement")}
              allowClear
              className="w-full"
              onChange={(v) => setFilters((f) => ({ ...f, displacement: v }))}
              options={[
                { label: "150cc", value: 150 },
                { label: "155cc", value: 155 },
                { label: "300cc", value: 300 },
                { label: "350cc", value: 350 },
              ]}
              size="large"
            />
          </Col>
          <Col xs={24} flex="1">
            <Select
              placeholder={t("vehicleModelModal.filter.year")}
              allowClear
              className="w-full"
              onChange={(v) => setFilters((f) => ({ ...f, year: v }))}
              options={[
                { label: "2025", value: "2025" },
                { label: "2024", value: "2024" },
                { label: "2023", value: "2023" },
              ]}
              size="large"
            />
          </Col>
          <Col xs={24} flex="1">
            <Select
              placeholder={t("vehicleModelModal.filter.fuelType")}
              allowClear
              className="w-full"
              onChange={(v) => setFilters((f) => ({ ...f, fuelType: v }))}
              options={[
                {
                  label: t("vehicleModelModal.filter.gasoline"),
                  value: ENUM_VEHICLE_MODEL_FUEL_TYPE.GASOLINE,
                },
                {
                  label: t("vehicleModelModal.filter.hybrid"),
                  value: ENUM_VEHICLE_MODEL_FUEL_TYPE.HYBRID,
                },
                {
                  label: t("vehicleModelModal.filter.electric"),
                  value: ENUM_VEHICLE_MODEL_FUEL_TYPE.ELECTRIC,
                },
                {
                  label: t("vehicleModelModal.filter.unknown"),
                  value: ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN,
                },
              ]}
              size="large"
            />
          </Col>
          <Col xs={24} flex="1">
            <Select
              placeholder={t("vehicleModelModal.filter.type")}
              allowClear
              className="w-full"
              onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
              options={[
                {
                  label: t("vehicleModelModal.filter.scooter"),
                  value: ENUM_VEHICLE_MODEL_TYPE.SCOOTER,
                },
                {
                  label: t("vehicleModelModal.filter.manual"),
                  value: ENUM_VEHICLE_MODEL_TYPE.MANUAL,
                },
                {
                  label: t("vehicleModelModal.filter.clutch"),
                  value: ENUM_VEHICLE_MODEL_TYPE.CLUTCH,
                },
                {
                  label: t("vehicleModelModal.filter.electricBike"),
                  value: ENUM_VEHICLE_MODEL_TYPE.ELECTRIC,
                },
                {
                  label: t("vehicleModelModal.filter.unknown"),
                  value: ENUM_VEHICLE_MODEL_TYPE.UNKNOWN,
                },
              ]}
              size="large"
            />
          </Col>
        </Row>
      )}

      <div className="min-h-[300px]">
        {!localSelectedBrand ? (
          <div className="flex justify-center items-center h-40 text-text-muted">
            {t("vehicleModelModal.noBrandSelected")}
          </div>
        ) : loadingModels ? (
          <div className="flex justify-center items-center h-40">
            {t("vehicleModelModal.loading")}
          </div>
        ) : paginatedModels.length === 0 ? (
          <Empty
            description={""}
            image={
              <img
                src="/images/motorbike-not-found.png"
                alt="Motorbike not found"
                className="mx-auto w-40 h-40 object-contain"
              />
            }
            className="flex flex-col items-center justify-center py-10"
          />
        ) : (
          <Row gutter={[16, 16]}>
            {paginatedModels.map((m) => (
              <Col xs={24} md={8} key={m.value}>
                <Card
                  hoverable
                  onClick={() =>
                    setSelectedModel((prev) =>
                      prev?.value === m.value ? null : m
                    )
                  }
                  className={`cursor-pointer ${
                    selectedModel?.value === m.value
                      ? "!border-primary-700 border-2"
                      : ""
                  }`}
                  cover={
                    <Image
                      src={m.image || "/images/image-holder-icon.png"}
                      alt={m.label}
                      className="object-cover !h-40 w-full"
                    />
                  }
                >
                  <h3 className="font-semibold">{m.label}</h3>
                  {m.year && (
                    <p className="text-sm text-text-muted">
                      {t("vehicleModelModal.filter.year")}: {m.year}
                    </p>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {filteredModels.length > pageSize && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filteredModels.length}
            onChange={(p) => setPage(p)}
          />
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onClose}>{t("vehicleModelModal.cancelButton")}</Button>
        <Button type="primary" onClick={handleSubmit} disabled={!selectedModel}>
          {t("vehicleModelModal.confirmButton")}
        </Button>
      </div>
    </Modal>
  );
}
