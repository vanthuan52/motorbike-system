import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  const t = useTranslations(TRANSLATION_FILES.FAQ_PAGE);

  return (
    <div className="mb-8">
      <Input.Search
        placeholder={t("searchPlaceholder")}
        allowClear
        size="large"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mx-auto block"
        style={{ borderRadius: "8px" }}
      />
    </div>
  );
};
