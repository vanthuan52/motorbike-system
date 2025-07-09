"use client";
import { Form, Input, Button } from "antd";
import BookingTabs from "./BookingTabs";
import CustomerInfoSection from "./CustomerInfoSection";
import VehicleInfoSection from "./VehicleInfoSection";
import ServiceDetailSection from "./ServiceDetailSection";
import PickupInfoSection from "./PickupInfoSection";
import PickupMapSection from "./PickupMapSection";
import PickupCostSection from "./PickupCostSection";
import { useBookingForm } from "../hooks/useBookingForm";
import { useVehicleBrandModel } from "../hooks/useVehicleBrandModel";
import { useServiceCategory } from "../hooks/useServiceCategory";

export default function VehicleMaintenanceRegistration() {
  const { form, serviceType, handleTabChange, handleFinish } = useBookingForm();

  const {
    selectedBrand,
    handleBrandChange,
    vehicleBrands,
    loadingVehicleBrands,
    loadingVehicleModels,
    modelOptions,
  } = useVehicleBrandModel();

  const { serviceCategories, loadingServiceCategories } = useServiceCategory();
  return (
    <div className="container mx-auto my-4 bg-white p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-3 uppercase">
        Đặt lịch bảo dưỡng xe
      </h1>
      <BookingTabs value={serviceType} onChange={handleTabChange} />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <CustomerInfoSection />
        <VehicleInfoSection
          brands={vehicleBrands}
          loadingVehicleBrands={loadingVehicleBrands}
          loadingVehicleModels={loadingVehicleModels}
          modelOptions={modelOptions}
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
          serviceCategories={serviceCategories}
          loadingServiceCategories={loadingServiceCategories}
        />
        <ServiceDetailSection />

        {serviceType === "pickup" && (
          <div className="flex flex-col gap-4">
            <PickupInfoSection />
            <PickupMapSection />
            <PickupCostSection />
          </div>
        )}
        <Form.Item
          label={<span className="font-semibold text-base">Ghi chú</span>}
          name="note"
        >
          <Input.TextArea
            rows={3}
            placeholder="Nhập thông tin thêm về tình trạng xe hoặc yêu cầu đặc biệt"
            maxLength={500}
            showCount
            size="large"
          />
        </Form.Item>
        <Form.Item className="mt-6">
          <Button
            color="default"
            variant="solid"
            htmlType="submit"
            className=" bg-black text-white font-bold text-base h-12 rounded-lg hover:bg-gray-800"
            size="large"
          >
            Xác nhận đặt lịch
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
