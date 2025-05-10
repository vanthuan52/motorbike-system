/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormItemReuse } from "@/components/ui/FormItemReuse";
import { VehicleCompanyTypes } from "@/types/VehicleCompany";

interface VehicleCompanyFormProps {
  formData: VehicleCompanyTypes;
  errors: any;
  handleChange: (field: keyof VehicleCompanyTypes, value: any) => void;
}

export function VehicleCompanyForm({
  formData,
  errors,
  handleChange,
}: VehicleCompanyFormProps) {
  return (
    <>
      <FormItemReuse
        label="Tên hãng xe"
        type="input"
        required={true}
        placeholder="Nhập tên hãng xe"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
      />

      <FormItemReuse
        label="Mô tả"
        type="textarea"
        placeholder="Nhập mô tả"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <FormItemReuse
        label="Trạng thái"
        required
        type="switch"
        value={formData.status}
        onChange={(checked) => handleChange("status", checked)}
      />
    </>
  );
}
