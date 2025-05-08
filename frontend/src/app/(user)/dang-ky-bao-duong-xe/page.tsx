"use client";
import Image from "next/image";
import { useState } from "react";
import { validate } from "@/utils/validation/MaintenanceRegistration";
import { MaintenanceRegistrationType } from "@/types/MaintenanceRegistration";
import {
  BadgeCheck,
  Bike,
  Bolt,
  Clock,
  Hash,
  Mail,
  MapPin,
  NotebookPen,
  Phone,
  User,
} from "lucide-react";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import Datepicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button/Button";
/**
 * Một thành phần chức năng cho trang đăng ký bảo dưỡng.
 *
 * Thành phần này hiển thị một biểu mẫu cho phép người dùng đăng ký bảo dưỡng xe.
 * Bao gồm các trường nhập thông tin khách hàng, thông tin chi tiết về xe và lịch hẹn.
 * Thành phần quản lý trạng thái biểu mẫu và xác thực bằng hook useState của React.
 *
 * - `formData`: Một đối tượng biểu thị các giá trị nhập biểu mẫu.
 * - `errors`: Một đối tượng biểu thị các thông báo lỗi xác thực cho từng trường biểu mẫu.
 * - `handleChange`: Một hàm để cập nhật các giá trị biểu mẫu và xác thực các đầu vào khi chúng thay đổi.
 * - `handleSubmit`: Một hàm để xử lý việc gửi biểu mẫu, xác thực tất cả các trường và ghi nhật ký dữ liệu nếu hợp lệ.
 *
 * Thành phần bao gồm các phần sau:
 * - Thông tin khách hàng: Tên, họ, email và số điện thoại.
 * - Thông tin xe: Loại xe, nhãn hiệu, loại dịch vụ và số xe.
 * - Thông tin cuộc hẹn: Ngày và giờ.
 * - Thông tin bổ sung: Địa chỉ và ghi chú tùy chọn.
 */

export default function Page() {
  const [formData, setFormData] = useState<MaintenanceRegistrationType>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    vehicle_type: "",
    vehicle_brand: "",
    service_type: "",
    vehicle_number: "",
    date: "",
    time: "",
    address: "",
    note: "",
  });

  const [errors, setErrors] = useState<typeof formData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    vehicle_type: "",
    vehicle_brand: "",
    service_type: "",
    vehicle_number: "",
    date: "",
    time: "",
    address: "",
    note: "",
  });

  // Dành cho input/select/textarea
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: keyof MaintenanceRegistrationType
  ) => {
    const value = e.target.value;
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    const fieldError = validate(updatedData)[field];
    setErrors({ ...errors, [field]: fieldError });
  };

  const handleDateChange = (date: Date | null) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";

    const updatedData = { ...formData, date: formattedDate };
    setFormData(updatedData);

    const fieldError = validate(updatedData).date;
    setErrors({ ...errors, date: fieldError });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((msg) => msg === "");
    if (!isValid) return;

    console.log("Submit data:", formData);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-4 py-6 lg:px-6 lg:py-10">
      <div className="flex flex-col items-center w-full lg:w-1/2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">
          Đăng ký bảo dưỡng xe
        </h1>
        <Image
          src="/images/dang-ky-bao-duong.png"
          alt="dang-ky-bao-duong-xe"
          width={600}
          height={600}
          className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[600px] h-auto"
        />
      </div>

      <form
        className="flex flex-col gap-5 w-full lg:w-1/2"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">
          Đặt lịch hẹn bảo trì
        </h1>

        {/* Thông tin khách hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            placeholder="Vui lòng nhập họ"
            value={formData.first_name}
            onChange={(e) => handleChange(e, "first_name")}
            error={errors.first_name}
            icon={<User size={20} />}
          />
          <InputField
            placeholder="Vui lòng nhập tên"
            value={formData.last_name}
            onChange={(e) => handleChange(e, "last_name")}
            error={errors.last_name}
            icon={<User size={20} />}
          />
          <InputField
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
            error={errors.email}
            icon={<Mail size={20} />}
          />
          <InputField
            placeholder="Vui lòng nhập số điện thoại"
            value={formData.phone_number}
            onChange={(e) => handleChange(e, "phone_number")}
            error={errors.phone_number}
            icon={<Phone size={20} />}
          />
        </div>

        {/* Thông tin xe máy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            options={["Xe số", "Xe ga", "Xe tay côn"]}
            value={formData.vehicle_type}
            onChange={(e) => handleChange(e, "vehicle_type")}
            error={errors.vehicle_type}
            icon={<Bike size={20} />}
            optionLabel="loại xe"
          />

          <InputField
            placeholder="Nhập hãng xe"
            value={formData.vehicle_brand}
            onChange={(e) => handleChange(e, "vehicle_brand")}
            error={errors.vehicle_brand}
            icon={<BadgeCheck size={20} />}
          />

          <SelectField
            options={["Bảo dưỡng", "Thay dầu", "Sửa chữa"]}
            value={formData.service_type}
            onChange={(e) => handleChange(e, "service_type")}
            error={errors.service_type}
            icon={<Bolt size={20} />}
            optionLabel="dịch vụ"
          />

          <InputField
            placeholder="Nhập biển số"
            value={formData.vehicle_number}
            onChange={(e) => handleChange(e, "vehicle_number")}
            error={errors.vehicle_number}
            icon={<Hash size={20} />}
          />
        </div>

        {/* Lịch hẹn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Datepicker
            value={formData.date ? new Date(formData.date) : null}
            onChange={handleDateChange}
            placeholder="Chọn ngày"
            error={errors.date}
          />

          <InputField
            placeholder="HH:MM"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange(e, "time")}
            error={errors.time}
            icon={<Clock size={20} />}
          />
        </div>

        <InputField
          placeholder="Nhập địa chỉ"
          value={formData.address}
          onChange={(e) => handleChange(e, "address")}
          error={errors.address}
          icon={<MapPin size={20} />}
        />
        <InputField
          placeholder="Thêm ghi chú nếu cần"
          type="textarea"
          value={formData.note}
          onChange={(e) => handleChange(e, "note")}
          error={errors.note}
          rows={1}
          icon={<NotebookPen size={20} />}
        />

        {/* Footer nút và thông báo */}
        <div className="flex flex-col md:flex-row w-full gap-2.5">
          <Button
            label="Đặt lịch"
            type="submit"
            className="w-full md:w-1/2 h-[45px] cursor-pointer"
          />
          <div className="flex flex-col gap-2 md:pl-2">
            <p className="text-sm md:text-md font-medium mt-2">
              Giờ hoạt động: <br />
              9:00 AM - 6:00 PM <br />
            </p>
            <p className="text-sm md:text-md font-medium mt-2">
              Vui lòng đến đúng giờ cho cuộc hẹn của bạn!
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
