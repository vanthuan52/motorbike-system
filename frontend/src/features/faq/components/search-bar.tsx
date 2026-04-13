import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  const t = useTranslations(TRANSLATION_FILES.FAQ_PAGE);

  return (
    <div className="mb-8 relative max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-text-muted z-10" size={20} />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full h-12 md:h-14 pl-12 pr-4 rounded-xl text-base"
        />
      </div>
    </div>
  );
};
