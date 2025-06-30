import { useTranslations } from "next-intl";
import { FiSearch } from "react-icons/fi";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function SearchBar({
  search,
  handleSearch,
}: {
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const t = useTranslations(TRANSLATION_FILES.PART_TYPE_PAGE);

  return (
    <div className="flex items-center justify-between bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 w-full mx-auto transition-all focus-within:shadow-md">
      <input
        type="text"
        placeholder={t("searchBar.placeholder")}
        value={search}
        onChange={handleSearch}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
      />
      <FiSearch className="text-gray-600 text-sm" />
    </div>
  );
}
