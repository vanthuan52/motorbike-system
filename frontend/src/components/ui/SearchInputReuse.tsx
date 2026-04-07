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
        <div className="pl-3 ml-2 !min-h-[30px] border-l border-border text-text-muted flex items-center justify-center w-full">
          <Search size={20} />
        </div>
      }
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full sm:max-w-xs rounded-[10px] hover:!border-border-strong focus:!border-primary-700 focus:!ring-0 !border-border !font-semibold !text-text-primary"
    />
  );
};
