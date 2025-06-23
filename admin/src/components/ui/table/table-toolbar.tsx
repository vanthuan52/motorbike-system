import React from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

interface TableToolbarProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string | string[];
  onAddNewClick?: () => void;
  placeholderSearch?: string;
  children?: React.ReactNode;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  onSearchChange,
  searchValue,
  onAddNewClick,
  placeholderSearch = "Search...",
  children,
}) => {
  return (
    <div className="flex justify-between mb-4 px-5 pt-4 gap-3 flex-wrap">
      <div className="flex items-center gap-3 flex-grow flex-wrap sm:flex-nowrap">
        {onSearchChange && (
          <Input
            placeholder={placeholderSearch}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="!w-68"
          />
        )}
        {children}
      </div>

      {onAddNewClick && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddNewClick}
          className="rounded-lg !bg-black !font-semibold flex-stretch"
        >
          Thêm mới
        </Button>
      )}
    </div>
  );
};

export default TableToolbar;
