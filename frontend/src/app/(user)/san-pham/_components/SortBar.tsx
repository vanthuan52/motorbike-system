import { Select, ConfigProvider } from "antd";
import { LayoutGrid, List } from "lucide-react";

interface props {
  sort: "relevance" | "price-asc" | "price-desc";
  onChange: (sort: "relevance" | "price-asc" | "price-desc") => void;
  total: number;
  showing: number;
  layout: "grid" | "list";
  onLayoutChange: (layout: "grid" | "list") => void;
}

const sortOptions = [
  { value: "relevance", label: "Liên quan" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
];

export default function SortBar({
  sort,
  onChange,
  total,
  showing,
  layout,
  onLayoutChange,
}: props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center md:gap-16 justify-between">
      <p className="text-sm text-gray-700 md:w-60">
        {showing} trên {total} Kết quả
      </p>
      <div className="flex items-center space-x-2 justify-between w-full mt-2">
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-md font-medium text-gray-700">
            Sắp xếp theo
          </label>
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  colorBgContainer: "#f3f4f6",
                  colorText: "#111827",
                  colorTextPlaceholder: "#6b7280",
                  colorBorder: "#d1d5db",
                  colorPrimaryHover: "#e5e7eb",
                  colorBgElevated: "#f3f4f6",
                  optionSelectedBg: "#e5e7eb",
                  optionSelectedColor: "#111827",
                },
              },
            }}
          >
            <Select
              id="sort"
              value={sort}
              onChange={(v) =>
                onChange(v as "relevance" | "price-asc" | "price-desc")
              }
              options={sortOptions}
              style={{ width: 180 }}
              popupMatchSelectWidth={false}
              dropdownStyle={{ color: "#111827" }}
            />
          </ConfigProvider>
        </div>
        <div className="flex items-center bg-gray-200 rounded-md ml-2">
          <button
            className="p-2 cursor-pointer"
            onClick={() => onLayoutChange("grid")}
            aria-label="Grid layout"
            type="button"
          >
            <LayoutGrid
              size={20}
              color={layout === "grid" ? "#111827" : "#9ca3af"}
            />
          </button>
          <button
            className="p-2 cursor-pointer"
            onClick={() => onLayoutChange("list")}
            aria-label="List layout"
            type="button"
          >
            <List size={20} color={layout === "list" ? "#111827" : "#9ca3af"} />
          </button>
        </div>
      </div>
    </div>
  );
}
