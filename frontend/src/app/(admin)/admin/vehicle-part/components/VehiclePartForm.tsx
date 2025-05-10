/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItemReuse } from "@/components/ui/FormItemReuse";
import { VehiclePart } from "@/types/VehiclePart";

interface VehiclePartFormProps {
  formData: any;
  errors: any;
  handleChange: (field: keyof VehiclePart, value: any) => void;
  handleUploadChange: (file: any) => void;
  handlePreview: (file: any) => void;
  fileList: any[];
  handleRemovePreview: (file: any) => void;
}

export default function VehiclePartForm({
  formData,
  errors,
  handleChange,
  handleUploadChange,
  handlePreview,
  fileList,
  handleRemovePreview,
}: VehiclePartFormProps) {
  return (
    <>
      <FormItemReuse
        label="Tên phụ tùng"
        type="input"
        required
        placeholder="Nhập tên phụ tùng"
        value={formData.name}
        onChange={(val) => handleChange("name", val.target.value)}
        error={errors.name}
      />

      <FormItemReuse
        label="Chọn loại xe"
        type="select"
        required
        placeholder="Chọn loại xe cho phụ tùng này"
        value={formData.vehicle_type_id}
        onChange={(val) => handleChange("vehicle_type_id", val)}
        options={[
          { label: "Kawasaki", value: "0" },
          { label: "Yamaha", value: "1" },
          { label: "Honda", value: "2" },
          { label: "Suzuki", value: "3" },
          { label: "SYM", value: "4" },
          { label: "Ducati", value: "5" },
        ]}
        error={errors.vehicle_type_id}
      />

      <FormItemReuse
        label="Tuổi thọ (Tháng)"
        type="input"
        required
        placeholder="Nhập tuổi thọ phụ tùng"
        value={formData.average_life}
        onChange={(val) => handleChange("average_life", val.target.value)}
        error={errors.average_life}
      />

      <FormItemReuse
        label="Giá (VNĐ)"
        type="input"
        required
        placeholder="Nhập giá phụ tùng"
        value={formData.unit_price}
        onChange={(val) => handleChange("unit_price", val.target.value)}
        error={errors.unit_price}
      />

      <FormItemReuse
        label="Số lượng"
        type="input"
        required
        placeholder="Nhập số lượng phụ tùng"
        value={formData.quantity}
        onChange={(val) => handleChange("quantity", val.target.value)}
        error={errors.quantity}
      />
      <FormItemReuse
        label="Hình ảnh"
        type="file"
        required
        value={formData.image}
        onChange={handleUploadChange}
        error={errors.image}
        fileList={fileList}
        handlePreview={handlePreview}
        handleRemovePreview={handleRemovePreview}
      />

      <FormItemReuse
        label="Trạng thái"
        type="switch"
        value={formData.status}
        onChange={(checked) => handleChange("status", checked)}
        error={errors.status}
      />
    </>
  );
}
