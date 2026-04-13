import { useTranslations } from "next-intl";
import { mockDataTableVehiclePart } from "@/data/TableData";
import { TRANSLATION_FILES } from "@/lib/i18n";

type StatusType = "in_stock" | "out_of_stock" | "out_of_business";
type FilterState = {
  status: StatusType[];
  price: [number, number];
  categories: string[];
};

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function ActiveFilters({ filters, setFilters }: Props) {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT);

  const hasFilter =
    filters.status.length > 0 ||
    filters.categories.length > 0 ||
    filters.price[0] > 0 ||
    filters.price[1] < 10000000;

  if (!hasFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {filters.status.map((status) => (
        <span
          key={status}
          className="flex items-center bg-gray-200 text-black rounded-[30px] px-4 py-1 text-sm"
        >
          {t(`activeFilters.status.${status}`)}
          <button
            className="ml-2 cursor-pointer text-lg font-bold text-gray-500 hover:text-red-500"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                status: prev.status.filter((s) => s !== status),
              }))
            }
            aria-label={t("activeFilters.remove")}
          >
            ×
          </button>
        </span>
      ))}
      {filters.categories.map((slug) => {
        const cat = mockDataTableVehiclePart.find((c) => c.slug === slug);
        return (
          <span
            key={slug}
            className="flex items-center bg-gray-200 text-black rounded-[30px] px-4 py-1 text-sm"
          >
            {cat ? cat.name : slug}
            <button
              className="ml-2 cursor-pointer text-lg font-bold text-gray-500 hover:text-red-500"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  categories: prev.categories.filter((s) => s !== slug),
                }))
              }
              aria-label={t("activeFilters.remove")}
            >
              ×
            </button>
          </span>
        );
      })}
      {(filters.price[0] > 0 || filters.price[1] < 10000000) && (
        <span className="flex items-center bg-gray-200 text-black rounded-[30px] px-4 py-1 text-sm">
          {filters.price[0].toLocaleString()} -{" "}
          {filters.price[1].toLocaleString()} VNĐ
          <button
            className="ml-2 cursor-pointer text-lg font-bold text-gray-500 hover:text-red-500"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                price: [0, 10000000],
              }))
            }
            aria-label={t("activeFilters.remove")}
          >
            ×
          </button>
        </span>
      )}
      <button
        className="ml-2 cursor-pointer text-sm text-gray-600 underline hover:text-gray-800 font-medium"
        onClick={() =>
          setFilters({
            status: [],
            price: [0, 10000000],
            categories: [],
          })
        }
      >
        {t("activeFilters.clearAll")}
      </button>
    </div>
  );
}
