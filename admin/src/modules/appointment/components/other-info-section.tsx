import { Card, Form, Input, Select } from "antd";
import { ENUM_PAGE_MODE } from "@/types/app.type";

const { TextArea } = Input;

type Option = { label: string; value: string };

type OtherInfoSectionProps = {
  mode: ENUM_PAGE_MODE;
  vehicleModelOptions: Option[];
  serviceCategoryOptions: Option[];
  loadingServiceCategory: boolean;
  loadingVehicleModels: boolean;
};

const OtherInfoSection = ({
  mode,
  vehicleModelOptions,
  serviceCategoryOptions,
  loadingServiceCategory,
  loadingVehicleModels,
}: OtherInfoSectionProps) => {
  const isDisabled = mode === ENUM_PAGE_MODE.VIEW;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Thông tin chi tiết</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <Form.Item
          label="Xe của người dùng"
          name="userVehicle"
          // rules={[
          //   { required: true, message: "Vui lòng chọn xe của người dùng" },
          // ]}
        >
          <Select
            // options={vehicleBrandOptions}
            placeholder="Chọn xe của người dùng"
            size="large"
            disabled={isDisabled}
            // loading={loadingVehicleBrands}
          />
        </Form.Item>

        <Form.Item
          label="Dòng xe"
          name="vehicleModel"
          rules={[{ required: true, message: "Vui lòng chọn dòng xe" }]}
        >
          <Select
            options={vehicleModelOptions}
            placeholder="Chọn dòng xe"
            size="large"
            disabled={isDisabled}
            loading={loadingVehicleModels}
          />
        </Form.Item>

        <Form.Item
          label="Dịch vụ"
          name="vehicleServices"
          rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
        >
          <Select
            mode="multiple"
            options={serviceCategoryOptions}
            placeholder="Chọn dịch vụ"
            size="large"
            disabled={isDisabled}
            loading={loadingServiceCategory}
          />
        </Form.Item>

        <Form.Item
          label="Biển số xe"
          name="licensePlate"
          rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}
        >
          <Input
            placeholder="Nhập biển số xe"
            size="large"
            disabled={isDisabled}
          />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <TextArea rows={4} placeholder="Nhập ghi chú" disabled={isDisabled} />
        </Form.Item>
      </div>
    </Card>
  );
};

export default OtherInfoSection;
