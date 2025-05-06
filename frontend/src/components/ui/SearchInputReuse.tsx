import { Input } from "antd";
import { Search } from "lucide-react";

interface Props {
  placeholder?: string;
  onChange?: (value: string) => void;
}

/**
 * A reusable search input component with a customizable placeholder and change handler.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {(value: string) => void} [props.onChange] - Callback function to handle changes in input value.
 *
 * @returns {JSX.Element} A styled input component with a search icon suffix.
 */

export const SearchInputReuse = ({ placeholder, onChange }: Props) => {
  return (
    <Input
      placeholder={placeholder || "Nhập từ khóa tìm kiếm..."}
      suffix={
        <div className="pl-3 ml-2 !min-h-[30px] border-l border-gray-300 text-gray-500 flex items-center justify-center">
          <Search size={20} />
        </div>
      }
      onChange={(e) => onChange?.(e.target.value)}
      className="max-w-xs rounded-[10px] hover:!border-gray-300 focus:!border-gray-300 focus:!ring-0 !border-gray-300 !font-semibold"
    />
  );
};
