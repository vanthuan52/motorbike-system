import { MaintenanceRegistrationType } from "@/types/MaintenanceRegistration";
import validator from "validator";

export const validate = (
  formData: MaintenanceRegistrationType,
  t: (key: string) => string
) => {
  const errors: Record<keyof MaintenanceRegistrationType, string> = {
    first_name: formData.first_name ? "" : t("errors.first_name"),
    last_name: formData.last_name ? "" : t("errors.last_name"),
    email: validator.isEmail(formData.email || "") ? "" : t("errors.email"),
    phone_number: validator.matches(formData.phone_number || "", /^\d{10}$/)
      ? ""
      : t("errors.phone_number"),
    vehicle_type: formData.vehicle_type ? "" : t("errors.vehicle_type"),
    vehicle_brand: formData.vehicle_brand ? "" : t("errors.vehicle_brand"),
    service_type: formData.service_type ? "" : t("errors.service_type"),
    vehicle_number: formData.vehicle_number ? "" : t("errors.vehicle_number"),
    date: validator.matches(formData.date || "", /^\d{4}-\d{2}-\d{2}$/)
      ? ""
      : t("errors.date"),
    time: validator.matches(
      formData.time || "",
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    )
      ? ""
      : t("errors.time"),
    address: formData.address ? "" : t("errors.address"),
    note: "", // optional
  };

  return errors;
};
