"use client";

import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useLocale, useTranslations } from "next-intl";
import { enUS } from "date-fns/locale";

interface DatepickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, placeholder, error }, ref) => (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <CalendarIcon size={20} />
      </div>
      <input
        type="text"
        ref={ref}
        value={value ? moment(value).format("DD-MM-YYYY") : ""}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className={`w-full min-h-[42px] pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-900 text-sm ${
          error ? "border-red-500 focus:ring-red-200" : "border-gray-300"
        }`}
      />
    </div>
  )
);

CustomInput.displayName = "CustomInput";

const Datepicker: React.FC<DatepickerProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
}) => {
  const t = useTranslations("vehicleMaintenancePage");
  const locale = useLocale();
  const dateFnsLocale = locale === "vi" ? vi : enUS;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="block font-semibold mb-1">
          <span className="text-red-500 mr-1">*</span>
          {label}
        </label>
      )}

      <ReactDatePicker
        selected={value}
        onChange={onChange}
        locale="vi"
        placeholderText={placeholder || t("form.date.placeholder")}
        calendarClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
        wrapperClassName="w-full"
        popperClassName="z-50"
        minDate={new Date()}
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <button
              onClick={decreaseMonth}
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon size={20} className="text-gray-600" />
            </button>
            <span className="text-gray-800 font-medium">
              {format(date, "MMMM yyyy", { locale: dateFnsLocale })}
            </span>
            <button
              onClick={increaseMonth}
              type="button"
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon size={20} className="text-gray-600" />
            </button>
          </div>
        )}
        dayClassName={(date) => {
          const isSelected =
            value && date.toDateString() === value.toDateString();
          return [
            "transition-colors rounded-full",
            isSelected
              ? "bg-green-100 text-green-800"
              : "hover:bg-green-50 text-gray-700",
          ].join(" ");
        }}
        customInput={
          <CustomInput
            error={error}
            placeholder={placeholder || t("form.date.placeholder")}
          />
        }
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Datepicker;
