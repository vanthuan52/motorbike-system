import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon, Search } from "lucide-react";

import RangeSlider from "@/components/ui/Slider";
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
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const dropdownVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: "easeInOut" as const },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" as const },
  },
};

export default function FilterSidebar({
  filters,
  onChange,
  categories,
  search,
  onSearch,
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

  const handlePriceChange = (val: [number, number]) => {
    onChange({ price: val });
  };

  const handleInputChange = (idx: 0 | 1, val: number) => {
    const next = [...filters.price] as [number, number];
    next[idx] = val;
    onChange({ price: next });
  };

  const handleResetAll = () => {
    onChange({ status: [], categories: [], price: [0, 10000000] });
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-lg font-semibold text-text-primary">
        {t("filterSidebar.title")}
      </span>

      <div className="flex flex-col gap-4 md:gap-6">
        {/* Search */}
        <div>
          <h3 className="font-medium text-text-primary mb-2">
            {t("searchBar.title")}
          </h3>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={onSearch}
              placeholder={t("searchBar.placeholder")}
              className="w-full pl-8 pr-3 py-2 text-base rounded-lg border border-border bg-surface
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                       transition-all duration-200"
            />
          </div>
        </div>

        {/* ── Status ── */}
        <div>
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setOpenStatus((v) => !v)}
          >
            <h3 className="font-medium text-text-primary">
              {t("filterSidebar.status.title")}
            </h3>
            {openStatus ? (
              <ChevronUpIcon className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-text-muted" />
            )}
          </div>
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
                      <span className="text-[15px] text-text-secondary">
                        {t(`filterSidebar.status.options.${value}`)}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Category ── */}
        <div>
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setOpenCategory((v) => !v)}
          >
            <h3 className="font-medium text-text-primary">
              {t("filterSidebar.category.title")}
            </h3>
            {openCategory ? (
              <ChevronUpIcon className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-text-muted" />
            )}
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
                      <span className="text-[15px] text-text-secondary">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Price ── */}
        <div>
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setOpenPrice((v) => !v)}
          >
            <h3 className="font-medium text-text-primary">
              {t("filterSidebar.price.title")}
            </h3>
            {openPrice ? (
              <ChevronUpIcon className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-text-muted" />
            )}
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
                <div className="w-full max-w-md mx-auto">
                  <RangeSlider
                    min={0}
                    max={10000000}
                    step={1000}
                    value={filters.price}
                    onChange={handlePriceChange}
                    className="p-3"
                  />
                  <div className="flex items-center gap-2 mt-4">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10000000}
                        step={1000}
                        value={filters.price[0]}
                        onChange={(e) =>
                          handleInputChange(0, Number(e.target.value))
                        }
                        className="w-full pl-3 pr-7 py-2 text-base rounded-lg border border-border bg-surface
                                   text-text-primary outline-none
                                   focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                                   transition-all duration-200
                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
                        đ
                      </span>
                    </div>
                    <span className="text-text-muted text-sm">–</span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10000000}
                        step={1000}
                        value={filters.price[1]}
                        onChange={(e) =>
                          handleInputChange(1, Number(e.target.value))
                        }
                        className="w-full pl-3 pr-7 py-2 text-base rounded-lg border border-border bg-surface
                                   text-text-primary outline-none
                                   focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                                   transition-all duration-200
                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="flex-1 py-2 text-base font-medium text-text-secondary
                     border border-border rounded-lg
                     hover:bg-bg-hover transition-colors duration-200"
          >
            {t("filterSidebar.reset")}
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-base font-medium text-white
                     bg-primary-500 rounded-lg
                     hover:bg-primary-600 transition-colors duration-200"
          >
            {t("filterSidebar.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
