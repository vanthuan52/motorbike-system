import { useTranslations } from "next-intl";
import React from "react";

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: {
    label: string;
    value: string;
  }[];
  error?: string;
  icon?: React.ReactNode;
  optionLabel?: string;
  values?: string[];
  rootClass?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  icon,
  optionLabel,
  values,
  rootClass,
}) => {
  const t = useTranslations("vehicleMaintenancePage");
  const selectClasses = `w-full py-2 pr-10 ${
    icon ? "pl-10" : "pl-4"
  } rounded-lg text-sm border bg-white appearance-none focus:outline-none transition duration-200 ease-in-out ${
    error
      ? "border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 "
  }`;

  return (
    <div className={`flex flex-col gap-1 w-full ${rootClass}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700" htmlFor={label}>
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center  pointer-events-none">
            {icon}
          </div>
        )}

        <select
          id={label}
          value={value}
          onChange={onChange}
          className={selectClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        >
          <option disabled value="">
            {t("selectOption")} {optionLabel}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="h-5">
        {error ? (
          <p id={`${label}-error`} className="text-red-500 text-sm">
            {error}
          </p>
        ) : (
          <span className="invisible text-sm">Placeholder</span>
        )}
      </div>
    </div>
  );
};

export default SelectField;
