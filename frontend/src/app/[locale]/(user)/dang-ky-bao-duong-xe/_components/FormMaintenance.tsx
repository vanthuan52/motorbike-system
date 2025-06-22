import { useTranslations } from "next-intl";
import React from "react";
import Button from "@/components/ui/Button/Button";
import Datepicker from "@/components/ui/DatePicker";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
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

interface props {
  formData: any;
  handleSubmit: any;
  errors: any;
  handleChange: any;
  handleDateChange: any;
}
export default function FormMaintenance({
  formData,
  handleSubmit,
  errors,
  handleChange,
  handleDateChange,
}: props) {
  const t = useTranslations("vehicleMaintenancePage");
  const vehicleTypeOptions = [
    { label: t("vehicleType.motorcycle"), value: "motorcycle" },
    { label: t("vehicleType.scooter"), value: "scooter" },
    { label: t("vehicleType.clutchBike"), value: "clutchBike" },
  ];
  return (
    <form
      className="flex flex-col gap-5 w-full lg:w-1/2"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        {t("titleForm")}
      </h2>
      <div className="">
        <h3 className="mb-4 text-lg md:text-xl font-semibold">
          Thông tin cơ bản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            placeholder={t("firstName")}
            value={formData.first_name}
            onChange={(e) => handleChange(e, "first_name")}
            error={errors.first_name}
            icon={<User size={20} />}
          />
          <InputField
            placeholder={t("lastName")}
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
            placeholder={t("phone")}
            value={formData.phone_number}
            onChange={(e) => handleChange(e, "phone_number")}
            error={errors.phone_number}
            icon={<Phone size={20} />}
          />
        </div>
      </div>

      {/* Thông tin xe máy */}
      <div className="">
        <h3 className="mb-4 text-lg md:text-xl font-semibold">
          {t("vehicleInfo")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            options={vehicleTypeOptions}
            value={formData.vehicle_type}
            onChange={(e) => handleChange(e, "vehicle_type")}
            error={errors.vehicle_type}
            icon={<Bike size={20} />}
            optionLabel={t("vehicleType.title")}
          />

          <InputField
            placeholder={t("vehicleBrand")}
            value={formData.vehicle_brand}
            onChange={(e) => handleChange(e, "vehicle_brand")}
            error={errors.vehicle_brand}
            icon={<BadgeCheck size={20} />}
          />

          <SelectField
            options={[
              { label: t("serviceType.maintenance"), value: "maintenance" },
              { label: t("serviceType.oilChange"), value: "oilChange" },
              { label: t("serviceType.repair"), value: "repair" },
            ]}
            value={formData.service_type}
            onChange={(e) => handleChange(e, "service_type")}
            error={errors.service_type}
            icon={<Bolt size={20} />}
            optionLabel={t("serviceType.title")}
          />

          <InputField
            placeholder={t("vehicleNumber")}
            value={formData.vehicle_number}
            onChange={(e) => handleChange(e, "vehicle_number")}
            error={errors.vehicle_number}
            icon={<Hash size={20} />}
          />
        </div>
      </div>
      <div className="">
        <h3 className="mb-4 text-lg md:text-xl font-semibold">
          {t("timeInfo")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Datepicker
            value={formData.date ? new Date(formData.date) : null}
            onChange={handleDateChange}
            placeholder={t("date")}
            error={errors.date}
          />

          <InputField
            placeholder={t("time")}
            type="time"
            value={formData.time}
            onChange={(e) => handleChange(e, "time")}
            error={errors.time}
            icon={<Clock size={20} />}
          />
        </div>

        <InputField
          placeholder={t("address")}
          value={formData.address}
          onChange={(e) => handleChange(e, "address")}
          error={errors.address}
          icon={<MapPin size={20} />}
        />
        <InputField
          placeholder={t("note")}
          type="textarea"
          value={formData.note}
          onChange={(e) => handleChange(e, "note")}
          error={errors.note}
          rows={1}
          icon={<NotebookPen size={20} />}
        />
      </div>

      <div className="">
        <div className="flex flex-col gap-2 md:pl-2">
          <p className="text-sm md:text-md font-medium mt-2">
            {t("workingHour")}
          </p>
          <p className="text-sm md:text-md font-medium mt-2">{t("onTime")}</p>
        </div>
      </div>

      {/* Footer nút và thông báo */}
      <div className="flex flex-col md:flex-row w-full gap-2.5">
        <Button
          label={t("submit")}
          type="submit"
          className="w-full h-[45px] cursor-pointer"
        />
      </div>
    </form>
  );
}
