"use client";
import Image from "next/image";
import { useState } from "react";
import { MaintenanceRegistrationType } from "@/types/MaintenanceRegistration";
import { validate } from "@/utils/validation/MaintenanceRegistration";
import FormMaintenance from "./_components/FormMaintenance";
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
    <div className="w-full py-6 lg:py-10">
      <div className="container flex flex-col lg:flex-row gap-10">
        <div className="flex flex-col items-center lg:w-1/2">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
            Đăng ký bảo dưỡng xe
          </h2>
          <Image
            src="/images/dang-ky-bao-duong.png"
            alt="dang-ky-bao-duong-xe"
            width={400}
            height={400}
            className="w-full max-w-[200px] md:max-w-[300px] lg:max-w-[500px] h-auto"
          />
        </div>

        <FormMaintenance formData={formData} handleSubmit={handleSubmit} errors={errors} handleChange={handleChange} handleDateChange={handleDateChange} />
      </div>
    </div>
  );
}
