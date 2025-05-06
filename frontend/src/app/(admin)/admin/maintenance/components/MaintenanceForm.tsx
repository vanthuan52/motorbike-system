/* eslint-disable @typescript-eslint/no-explicit-any */
import Datepicker from "@/components/ui/DatePicker";
import { FormItemReuse } from "@/components/ui/FormItemReuse";
import { MaintenanceManagementTypes } from "@/types/MaintenanceManagementTypes";

interface MaintenanceFormProps {
  formData: any;
  errors: any;
  handleChange: (field: keyof MaintenanceManagementTypes, value: any) => void;
  handleDateChange: (date: any) => void;
}

export default function MaintenanceForm({
  formData,
  errors,
  handleChange,
  handleDateChange,
}: MaintenanceFormProps) {
  const staffOptions = [
    { id: 0, name: "Nguyen", phone: "0123456789", email: "nguyen@example.com" },
    { id: 1, name: "Thanh", phone: "0987654321", email: "thanh@example.com" },
  ]; // mock data
  return (
    <>
      <FormItemReuse
        label="Khách hàng"
        required
        type="input"
        value={formData.customer}
        onChange={(val) => handleChange("customer", val.target.value)}
        error={errors.customer}
        placeholder="Nhập tên khách hàng"
      />
      <FormItemReuse
        label="Số điện thoại"
        required
        type="input"
        value={formData.phone}
        onChange={(val) => handleChange("phone", val.target.value)}
        placeholder="Nhập số điện thoại"
        error={errors.phone}
      />
      <FormItemReuse
        label="Nhân viên"
        type="select"
        required
        placeholder="Chọn nhân viên"
        value={formData.staff.name}
        options={staffOptions.map((s) => ({
          label: s.name,
          value: s.id.toString(),
        }))}
        onChange={(val) => {
          const selectedStaff = staffOptions.find(
            (s) => s.id.toString() === val
          );
          handleChange("staff", selectedStaff || null);
        }}
        error={errors.staff}
      />

      <Datepicker
        value={
          formData.maintenance_date ? new Date(formData.maintenance_date) : null
        }
        onChange={handleDateChange}
        placeholder="Chọn ngày"
        error={errors.maintenance_date}
      />
      <FormItemReuse
        label="Tổng chi phí"
        required
        type="input"
        value={formData.total_cost}
        onChange={(val) => handleChange("total_cost", val.target.value)}
        error={errors.total_cost}
        placeholder="Nhập tổng chi phí"
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
