import React from "react";
import { Select } from "antd";

const { Option } = Select;

export interface SelectOptionItem {
  value: string | number;
  label: string;
}

interface SelectOptionProps {
  options: SelectOptionItem[];
  placeholder?: string;
  value?: string | string[] | undefined;
  onChange?: (value: string | string[] | undefined) => void;
  className?: string;
  disabled?: boolean;
  allowClear?: boolean;
  loading?: boolean;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  options,
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  allowClear = false,
  loading = false,
}) => {
  const selectedValue = value === "all" ? undefined : value;

  return (
    <Select
      placeholder={placeholder}
      value={selectedValue}
      onChange={(newValue) => {
        if (onChange) {
          onChange(newValue === undefined ? undefined : newValue);
        }
      }}
      className={`rounded-lg ${className ?? ""}`}
      disabled={disabled}
      allowClear={allowClear}
      loading={loading}
    >
      {options.map((option) => (
        <Option key={String(option.value)} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default SelectOption;
