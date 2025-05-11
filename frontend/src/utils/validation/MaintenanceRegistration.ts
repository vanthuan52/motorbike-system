import { MaintenanceRegistrationType } from "@/types/MaintenanceRegistration";
import validator from "validator";

export const validate = (formData: MaintenanceRegistrationType) => {
  const errors: Record<keyof MaintenanceRegistrationType, string> = {
    first_name: formData.first_name ? "" : "Vui lòng nhập họ",
    last_name: formData.last_name ? "" : "Vui lòng nhập tên",
    email: validator.isEmail(formData.email || "") ? "" : "Vui lòng nhập email",
    phone_number: validator.matches(formData.phone_number || "", /^\d{10}$/)
      ? ""
      : "Vui lòng nhập số điện thoại",
    vehicle_type: formData.vehicle_type ? "" : "Vui lòng chọn loại xe",
    vehicle_brand: formData.vehicle_brand ? "" : "Vui lòng nhập hãng xe",
    service_type: formData.service_type ? "" : "Vui lòng chọn loại dịch vụ",
    vehicle_number: formData.vehicle_number ? "" : "Vui lòng nhập biển số xe",
    date: validator.matches(formData.date || "", /^\d{4}\-\d{2}\-\d{2}$/)
      ? ""
      : "Vui lòng chọn ngày",
    time: validator.matches(
      formData.time || "",
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    )
      ? ""
      : "Vui lòng chọn thời gian",
    address: formData.address ? "" : "Vui lòng nhập địa chỉ",
    note: "", // không bắt buộc
  };

  return errors;
};
