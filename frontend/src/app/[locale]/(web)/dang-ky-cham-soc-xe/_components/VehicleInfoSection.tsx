import { Row, Col, Form, Select, Input } from "antd";
import { VehicleBrand } from "@/features/vehicle-brand/types";
import { ServiceCategory } from "@/features/service-category/types";

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
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={<span className="font-semibold text-base">Hãng xe</span>}
          name="vehicleBrand"
          rules={[{ required: true, message: "Vui lòng chọn hãng xe" }]}
        >
          <Select
            placeholder="Select..."
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
          label={<span className="font-semibold text-base">Tên xe</span>}
          name="vehicleModel"
          rules={[{ required: true, message: "Vui lòng chọn tên xe" }]}
        >
          <Select
            placeholder="Select..."
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
          label={<span className="font-semibold text-base">Biển số xe</span>}
          name="vehicleNumber"
          rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}
        >
          <Input placeholder="Nhập Biển số xe" size="large" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          label={
            <span className="font-semibold text-base">
              Gói bảo dưỡng, sửa chữa
            </span>
          }
          name="serviceCategories"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn gói bảo dưỡng, sửa chữa",
            },
          ]}
        >
          <Select
            placeholder="Select..."
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
