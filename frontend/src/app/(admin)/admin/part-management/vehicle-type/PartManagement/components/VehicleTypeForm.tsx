/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItemReuse } from "@/components/ui/FormItemReuse";
import { VehicleType } from "@/types/VehicleType";

interface VehicleTypeFormProps {
  formData: VehicleType;
  errors: Partial<Record<keyof VehicleType, string>>;
  handleChange: (field: keyof VehicleType, value: any) => void;
}

export default function VehicleTypeForm({
  formData,
  errors,
  handleChange,
}: VehicleTypeFormProps) {
  return (
    <>
      <FormItemReuse
        label="Tên loại xe"
        type="input"
        required
        placeholder="Nhập tên loại xe"
        value={formData.name}
        onChange={(val) => handleChange("name", val.target.value)}
        error={errors.name}
      />

      <FormItemReuse
        label="Mã hãng xe"
        type="select"
        required
        placeholder="Chọn mã hãng xe"
        value={formData.company_id}
        onChange={(val) => handleChange("company_id", val.target.value)}
        error={errors.company_id}
        options={[
          {
            label: "Kawasaki",
            value: "0",
          },
          {
            label: "Yamaha",
            value: "1",
          },
          {
            label: "Honda",
            value: "2",
          },
          {
            label: "Suzuki",
            value: "3",
          },
          {
            label: "SYM",
            value: "4",
          },
          {
            label: "Ducati",
            value: "5",
          },
        ]}
      />

      <FormItemReuse
        label="Mô tả"
        type="textarea"
        placeholder="Nhập mô tả"
        value={formData.description}
        onChange={(val) => handleChange("description", val.target.value)}
        error={errors.description}
      />

      <FormItemReuse
        label="Trạng thái"
        type="switch"
        value={formData.status}
        onChange={(val) => handleChange("status", val)}
        error={errors.status}
      />
    </>
  );
}
