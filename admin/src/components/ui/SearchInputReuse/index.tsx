import { Input } from "antd";
import { Search } from "lucide-react";

interface Props {
  placeholder?: string;
  onChange?: (value: string) => void;
}
export const SearchInputReuse = ({ placeholder, onChange }: Props) => {
  return (
    <Input
      placeholder={placeholder || "Nhập từ khóa tìm kiếm..."}
      suffix={
        <div className="pl-3 ml-2 !min-h-[30px] border-l border-gray-300 text-gray-500 flex items-center justify-center w-full">
          <Search size={20} />
        </div>
      }
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full sm:max-w-xs rounded-[10px] hover:!border-gray-300 focus:!border-gray-300 focus:!ring-0 !border-gray-300 !font-semibold"
    />
  );
};
