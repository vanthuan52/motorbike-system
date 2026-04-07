import { Input } from "antd";
import { FaSearch, FaChevronDown } from "react-icons/fa";

interface Props {
  searchText: string;
  setSearchText: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  setPage: (v: number) => void;
}

export default function PurchaseSearchSort({
  searchText,
  setSearchText,
  sortBy,
  setSortBy,
  setPage,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          allowClear
          size="large"
          addonBefore={<FaSearch className="text-text-disabled" />}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-muted">Sắp xếp theo:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-border-strong rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price_desc">Tổng tiền giảm dần</option>
            <option value="price_asc">Tổng tiền tăng dần</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
