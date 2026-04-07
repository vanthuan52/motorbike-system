import { useTranslations } from "next-intl";
import { ConfigProvider, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ENUM_HIRING_JOB_TYPE } from "@/features/hiring/types";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function CareerSearchFilter({
  search,
  handleSearch,
  type,
  setType,
}: {
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  setType: (v: string) => void;
}) {
  const t = useTranslations(`${TRANSLATION_FILES.HIRING}.searchFilter`);

  const JOB_TYPE_OPTIONS = [
    {
      label: t("jobTypes.full_time"),
      value: ENUM_HIRING_JOB_TYPE.FULL_TIME,
    },
    {
      label: t("jobTypes.part_time"),
      value: ENUM_HIRING_JOB_TYPE.PART_TIME,
    },
    {
      label: t("jobTypes.contract"),
      value: ENUM_HIRING_JOB_TYPE.CONTRACT,
    },
    { label: t("jobTypes.etc"), value: ENUM_HIRING_JOB_TYPE.ETC },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000",
          colorText: "#111",
          colorBorder: "#d9d9d9",
          colorBgContainer: "#fff",
        },
        components: {
          Input: {
            borderRadius: 8,
            colorTextPlaceholder: "#aaa",
          },
          Select: {
            borderRadius: 8,
            colorTextPlaceholder: "#999",
            colorBgElevated: "#fff",
            colorText: "#111",
            optionSelectedBg: "#f5f5f5",
            optionActiveBg: "#f0f0f0",
          },
        },
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-text-secondary mb-1">
            {t("searchLabel")}
          </label>
          <Input
            placeholder={t("searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={search}
            onChange={handleSearch}
            allowClear
            size="large"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-text-secondary mb-1">
            {t("jobTypeLabel")}
          </label>
          <Select
            placeholder={t("jobTypePlaceholder")}
            size="large"
            value={type}
            onChange={setType}
            allowClear
          >
            {JOB_TYPE_OPTIONS.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </ConfigProvider>
  );
}
