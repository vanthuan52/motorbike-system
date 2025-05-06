import { MaintenanceManagementTypes } from "../../types/MaintenanceManagementTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateFieldMaintenanceManagement = (
  fieldName: keyof MaintenanceManagementTypes,
  value: any
) => {
  switch (fieldName) {
    case "customer":
      if (!value || Object.keys(value).length === 0)
        return "Khách hàng là bắt buộc";
      break;
    case "phone":
      if (!value) return "Số điện thoại là bắt buộc";
      if (!/^\d{10,11}$/.test(value.toString()))
        return "Số điện thoại không hợp lệ";
      break;
    case "staff":
      if (!value || Object.keys(value).length === 0)
        return "Nhân viên là bắt buộc";
      break;
    case "maintenance_date":
      if (!value || value.trim() === "") return "Ngày bảo trì là bắt buộc";
      break;
    case "total_cost":
      if (value !== null && (isNaN(value) || value < 0))
        return "Tổng chi phí phải là số hợp lệ";
      break;
    default:
      return undefined;
  }

  return undefined;
};
