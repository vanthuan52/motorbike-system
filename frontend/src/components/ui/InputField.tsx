import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/common.utils";

interface InputFieldProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  icon?: React.ReactNode;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  rows = 3,
  disabled = false,
  autoFocus = false,
  className,
  required = false,
}) => {
  const isTextarea = type === "textarea";
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const inputClasses = cn(
    // Base
    "w-full min-h-[44px] flex py-3 pr-10 rounded-[var(--radius-md)] text-base border bg-surface text-text-primary shadow-[var(--shadow-inner)] outline-none",
    // M3 transition
    "[transition:border-color_var(--m3-transition-standard),box-shadow_var(--m3-transition-standard)]",
    // Placeholder
    "placeholder:text-text-muted",
    // Icon padding
    icon ? "pl-10" : "pl-4",
    // Hover
    "hover:border-border-strong",
    // Focus
    "focus:border-primary-500 focus:shadow-[var(--shadow-focus-ring)] focus:border-2",
    // Error state
    error
      ? "border-error shadow-[0_0_0_3px_rgba(220,38,38,0.15)] bg-error-bg"
      : "border-border",
    // Disabled
    disabled && "cursor-not-allowed opacity-50 bg-surface-alt",
    className
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!disabled) {
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          className="text-sm font-medium text-text-primary"
          htmlFor={label}
        >
          {label}
          {required && (
            <span className="text-error ml-0.5">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
            {icon}
          </div>
        )}

        {isTextarea ? (
          <textarea
            rows={rows}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className={inputClasses}
            disabled={disabled}
            autoFocus={autoFocus}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
          />
        ) : (
          <input
            type={inputType}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className={inputClasses}
            disabled={disabled}
            autoFocus={autoFocus}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center focus:outline-none text-text-muted hover:text-text-secondary cursor-pointer transition-colors duration-150"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
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

export default InputField;
