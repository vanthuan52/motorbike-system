import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Divider, ConfigProvider, Slider, InputNumber } from "antd";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { TRANSLATION_FILES } from "@/lib/i18n";

type StatusType = "in_stock" | "out_of_stock" | "out_of_business";
type Category = { id: string; name: string; slug: string };
type FilterState = {
  categories: string[];
  status: StatusType[];
  price: [number, number];
};

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  categories: Category[];
}

const dropdownVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

export default function FilterSidebar({
  filters,
  onChange,
  categories,
}: FilterSidebarProps) {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT);

  const [openStatus, setOpenStatus] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);

  const handleStatusChange =
    (status: StatusType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextStatus = e.target.checked
        ? [...filters.status, status]
        : filters.status.filter((s) => s !== status);
      onChange({ status: nextStatus });
    };

  const handleCategoryChange =
    (slug: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked
        ? [...filters.categories, slug]
        : filters.categories.filter((s) => s !== slug);
      onChange({ categories: next });
    };

  const handlePriceChange = (val: number[] | number) => {
    if (Array.isArray(val) && val.length === 2) {
      onChange({ price: [val[0], val[1]] });
    }
  };

  const handleInputChange = (idx: 0 | 1, val: number | null) => {
    const next = [...filters.price] as [number, number];
    next[idx] = val ?? next[idx];
    onChange({ price: next });
  };

  const handleReset = () =>
    onChange({ status: [], price: [0, 10000000], categories: [] });

  return (
    <div className="space-y-6 p-2 md:p-0">
      <div>
        <span className="text-lg font-semibold">
          {t("filterSidebar.title")}
        </span>
        <Divider />
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => setOpenStatus((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {t("filterSidebar.status.title")}
            </h3>
            {openStatus ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <span
            className="cursor-pointer text-gray-400 hover:text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ status: [] });
            }}
          >
            {t("filterSidebar.reset")}
          </span>
        </div>
        <Divider />
        <AnimatePresence initial={false}>
          {openStatus && (
            <motion.div
              key="status"
              initial="closed"
              animate="open"
              exit="closed"
              variants={dropdownVariants}
              style={{ overflow: "hidden" }}
              className="mt-2"
            >
              <div className="flex flex-col gap-1">
                {(
                  [
                    "in_stock",
                    "out_of_stock",
                    "out_of_business",
                  ] as StatusType[]
                ).map((value) => (
                  <label
                    key={value}
                    className="inline-flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.includes(value)}
                      onChange={handleStatusChange(value)}
                      className="custom-checkbox"
                    />
                    <span className="text-sm text-gray-600">
                      {t(`filterSidebar.status.options.${value}`)}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => setOpenCategory((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {t("filterSidebar.category.title")}
            </h3>
            {openCategory ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <span
            className="cursor-pointer text-gray-400 hover:text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ categories: [] });
            }}
          >
            {t("filterSidebar.reset")}
          </span>
        </div>
        <AnimatePresence initial={false}>
          {openCategory && (
            <motion.div
              key="category"
              initial="closed"
              animate="open"
              exit="closed"
              variants={dropdownVariants}
              style={{ overflow: "hidden" }}
              className="mt-2"
            >
              <div className="max-h-60 overflow-y-auto flex flex-col gap-1 pr-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="inline-flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat.slug)}
                      onChange={handleCategoryChange(cat.slug)}
                      className="custom-checkbox"
                    />
                    <span className="text-sm text-gray-600">{cat.name}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Divider />
      <div>
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => setOpenPrice((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {t("filterSidebar.price.title")}
            </h3>
            {openPrice ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <span
            className="cursor-pointer text-gray-400 hover:text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ price: [0, 10000000] });
            }}
          >
            {t("filterSidebar.reset")}
          </span>
        </div>
        <AnimatePresence initial={false}>
          {openPrice && (
            <motion.div
              key="price"
              initial="closed"
              animate="open"
              exit="closed"
              variants={dropdownVariants}
              style={{ overflow: "hidden" }}
              className="mt-2"
            >
              <ConfigProvider
                theme={{
                  components: {
                    Slider: {
                      trackBg: "#000",
                      railBg: "#d1d5db",
                      handleColor: "#000",
                      trackHoverBg: "#000",
                    },
                  },
                }}
              >
                <div className="w-full max-w-md mx-auto p-2">
                  <Slider
                    range
                    min={0}
                    max={10000000}
                    step={1000}
                    value={filters.price}
                    onChange={handlePriceChange}
                  />
                  <div className="flex justify-between items-center mt-4 gap-4">
                    <InputNumber
                      type="number"
                      min={0}
                      max={10000000}
                      step={1000}
                      value={filters.price[0]}
                      onChange={(v) => handleInputChange(0, v)}
                      style={{ width: 200 }}
                      addonAfter={<span className="text-gray-500">VNĐ</span>}
                    />
                    -
                    <InputNumber
                      type="number"
                      min={0}
                      max={10000000}
                      step={1000}
                      value={filters.price[1]}
                      onChange={(v) => handleInputChange(1, v)}
                      style={{ width: 200 }}
                      addonAfter={<span className="text-gray-500">VNĐ</span>}
                    />
                  </div>
                </div>
              </ConfigProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
