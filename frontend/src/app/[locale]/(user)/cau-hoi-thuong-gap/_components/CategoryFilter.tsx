import clsx from "clsx";
import { useTranslations } from "next-intl";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) => {
  const t = useTranslations("faqPage.categories");

  const categories = [
    { key: "all", label: t("all") },
    { key: "booking", label: t("booking") },
    { key: "payment", label: t("payment") },
    { key: "warranty", label: t("warranty") },
    { key: "service", label: t("service") },
    { key: "info", label: t("info") },
  ];

  return (
    <div className="mb-8 px-4">
      <div
        className="
          grid grid-cols-3 gap-3 text-center
          sm:flex sm:flex-wrap sm:justify-center sm:gap-3
        "
      >
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium",
              selectedCategory === key
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
