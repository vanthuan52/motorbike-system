import React from "react";
import { cn } from "@/utils/common.utils";

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
  required?: boolean;
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
  required = false,
}) => {
  const selectClasses = cn(
    // Base
    "w-full min-h-[44px] py-3 pr-10 rounded-[var(--radius-md)] text-base border bg-surface text-text-primary appearance-none shadow-[var(--shadow-inner)] outline-none",
    // M3 transition
    "[transition:border-color_var(--m3-transition-standard),box-shadow_var(--m3-transition-standard)]",
    // Icon padding
    icon ? "pl-10" : "pl-4",
    // Hover
    "hover:border-border-strong",
    // Focus
    "focus:border-primary-500 focus:shadow-[var(--shadow-focus-ring)] focus:border-2",
    // Error
    error
      ? "border-error shadow-[0_0_0_3px_rgba(220,38,38,0.15)] bg-error-bg"
      : "border-border"
  );

  return (
    <div className={cn("flex flex-col gap-1 w-full", rootClass)}>
      {label && (
        <label
          className="text-sm font-medium text-text-primary"
          htmlFor={label}
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
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
            {optionLabel}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-muted">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="min-h-5">
        {error ? (
          <p id={`${label}-error`} className="text-sm text-error-text">
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
