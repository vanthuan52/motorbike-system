import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  const t = useTranslations("faqPage");

  return (
    <div className="mb-8">
      <Input.Search
        placeholder={t("searchPlaceholder")}
        allowClear
        size="large"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md mx-auto block"
        style={{ borderRadius: "8px" }}
      />
    </div>
  );
};
