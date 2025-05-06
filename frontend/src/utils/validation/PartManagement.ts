/* eslint-disable @typescript-eslint/no-explicit-any */
import { VehicleType } from "@/types/VehicleType";
import { VehiclePart } from "@/types/VehiclePart";
import { VehicleCompanyTypes } from "@/types/VehicleCompany";
export const validateFieldVehicleType = (
  fieldName: keyof VehicleType,
  value: any
) => {
  switch (fieldName) {
    case "name":
      if (!value?.toString().trim()) return "Tên loại xe là bắt buộc";
      break;
    case "company_id":
      if (value === null || value === undefined || value === "")
        return "Vui lòng chọn hãng xe";
      break;
    default:
      return undefined;
  }

  return undefined;
};
export const validateFieldVehicleCompany = (
  fieldName: keyof VehicleCompanyTypes,
  value: any
) => {
  switch (fieldName) {
    case "name":
      if (!value?.toString().trim()) return "Tên hãng xe là bắt buộc";
      break;
    default:
      return undefined;
  }

  return undefined;
};
export const validateFieldVehiclePart = (
  fieldName: keyof VehiclePart,
  value: any
) => {
  switch (fieldName) {
    case "name":
      if (!value?.toString().trim()) return "Tên phụ tùng là bắt buộc";
      break;
    case "vehicle_type_id":
      if (value === null || value === undefined || value === "")
        return "Vui lòng chọn loại xe";
      break;
    case "average_life":
      if (value === undefined || value === null || Number(value) <= 0)
        return "Tuổi thọ phụ tùng là bắt buộc và lớn hơn 0";
      break;
    case "unit_price":
      if (value === undefined || value === null || Number(value) <= 0)
        return "Giá phụ tùng là bắt buộc và lớn hơn 0";
      break;
    case "quantity":
      if (value === undefined || value === null || Number(value) <= 0)
        return "Số lượng phụ tùng là bắt buộc và lớn hơn 0";
      break;
    case "image":
      if (value === null || value === undefined || value === "")
        return "Vui lòng chọn hình anh";
      break;
    default:
      return undefined;
  }

  return undefined;
};
