import { useTranslations } from "next-intl";
import { Collapse } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import type { FAQItem } from "@/data/FaqData";
import { TRANSLATION_FILES } from "@/lib/i18n";

interface FAQListProps {
  filteredFAQs: FAQItem[];
  expandedPanels: string[];
  setExpandedPanels: (keys: string[]) => void;
}

export const FAQList = ({
  filteredFAQs,
  expandedPanels,
  setExpandedPanels,
}: FAQListProps) => {
  const t = useTranslations(TRANSLATION_FILES.FAQ_PAGE);
  const collapseItems: CollapseProps["items"] = filteredFAQs.map((faq) => ({
    key: faq.key,
    label: (
      <div className="flex items-center gap-3">
        <QuestionCircleOutlined className="text-red-500" />
        <span className="font-medium text-gray-800">
          {t(`faqs.${faq.key}question`)}
        </span>
      </div>
    ),
    children: (
      <div className="text-gray-600 leading-relaxed pl-6">
        {t(`faqs.${faq.key}answer`)}
      </div>
    ),
  }));

  const handlePanelChange = (key: string | string[] | undefined) => {
    if (!key) {
      setExpandedPanels([]);
    } else if (typeof key === "string") {
      setExpandedPanels([key]);
    } else {
      setExpandedPanels(key);
    }
  };

  return (
    <div>
      {filteredFAQs.length > 0 ? (
        <Collapse
          accordion
          items={collapseItems}
          activeKey={expandedPanels}
          onChange={handlePanelChange}
          size="large"
          className="bg-white"
          style={{ border: "none", background: "transparent" }}
          expandIconPosition="end"
        />
      ) : (
        <div className="text-center py-12">
          <QuestionCircleOutlined className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg font-semibold">
            {t("noResults.title")}
          </p>
          <p className="text-gray-500">{t("noResults.description")}</p>
        </div>
      )}
    </div>
  );
};
