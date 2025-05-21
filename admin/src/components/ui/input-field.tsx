import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
}) => {
  const isTextarea = type === "textarea";
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const inputClasses = `w-full min-h-[42px] flex py-2 pr-10 ${
    icon ? "pl-10" : "pl-3"
  } rounded-lg text-sm border bg-white focus:outline-none focus:ring-2 ${
    error ? "border-red-500 focus:ring-red-200" : "border-gray-300 "
  } ${disabled ? "cursor-not-allowed opacity-50" : ""}`;

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
        <label className="text-sm font-medium text-gray-700" htmlFor={label}>
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
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
            className={`${inputClasses} ${className || ""}`}
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
            className={`${inputClasses} ${className || ""}`}
            disabled={disabled}
            autoFocus={autoFocus}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
          />
        )}

        {/* Toggle show/hide password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center focus:outline-none text-gray-500 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
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

export default InputField;
