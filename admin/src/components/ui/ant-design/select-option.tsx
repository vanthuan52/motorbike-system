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
  value?: string | number | null;
  onChange: (value: string | number) => void;
  className?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  options,
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  allowClear = false,
}) => {
  const selectedValue = value === undefined || value === "" ? null : value;

  return (
    <Select
      placeholder={placeholder}
      value={selectedValue}
      onChange={onChange}
      className={`rounded-lg ${className ?? ""}`}
      disabled={disabled}
      allowClear={allowClear}
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
