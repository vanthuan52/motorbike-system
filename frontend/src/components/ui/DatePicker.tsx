"use client";

import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useLocale } from "next-intl";
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
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
        <CalendarIcon size={20} />
      </div>
      <input
        type="text"
        ref={ref}
        value={value ? moment(value).format("DD-MM-YYYY") : ""}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className={`w-full min-h-[44px] pl-10 pr-4 py-3 border rounded-[var(--radius-md)] outline-none bg-surface text-text-primary text-base shadow-[var(--shadow-inner)] transition-[border-color,box-shadow] duration-200 ease-in-out hover:border-border-strong focus:border-primary-700 focus:shadow-[var(--shadow-focus-ring)] focus:border-2 cursor-pointer ${
          error
            ? "border-error shadow-[0_0_0_3px_rgba(220,38,38,0.15)] bg-error-bg"
            : "border-border"
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
  const locale = useLocale();
  const dateFnsLocale = locale === "vi" ? vi : enUS;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="block font-semibold text-text-primary mb-1">
          <span className="text-error mr-1">*</span>
          {label}
        </label>
      )}

      <ReactDatePicker
        selected={value}
        onChange={onChange}
        locale="vi"
        placeholderText={placeholder || "Pick a day..."}
        calendarClassName="bg-surface border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]"
        wrapperClassName="w-full"
        popperClassName="z-50"
        minDate={new Date()}
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <button
              onClick={decreaseMonth}
              type="button"
              className="p-1 hover:bg-secondary-100 rounded-[var(--radius-sm)] transition-colors duration-150 cursor-pointer"
            >
              <ChevronLeftIcon size={20} className="text-text-secondary" />
            </button>
            <span className="text-text-primary font-medium">
              {format(date, "MMMM yyyy", { locale: dateFnsLocale })}
            </span>
            <button
              onClick={increaseMonth}
              type="button"
              className="p-1 hover:bg-secondary-100 rounded-[var(--radius-sm)] transition-colors duration-150 cursor-pointer"
            >
              <ChevronRightIcon size={20} className="text-text-secondary" />
            </button>
          </div>
        )}
        dayClassName={(date) => {
          const isSelected =
            value && date.toDateString() === value.toDateString();
          return [
            "transition-colors rounded-full cursor-pointer",
            isSelected
              ? "bg-primary-100 text-primary-800"
              : "hover:bg-primary-50 text-text-primary",
          ].join(" ");
        }}
        customInput={
          <CustomInput
            error={error}
            placeholder={placeholder || "Pick a day..."}
          />
        }
      />

      {error && <p className="text-error-text text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Datepicker;
