import { useTranslations } from "next-intl";
import { Collapse } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import type { FAQItem } from "@/data/FaqData";

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
  const t = useTranslations("faqPage.noResults");
  const tFaq = useTranslations("faqPage.faqs");
  const collapseItems: CollapseProps["items"] = filteredFAQs.map((faq) => ({
    key: faq.key,
    label: (
      <div className="flex items-center gap-3">
        <QuestionCircleOutlined className="text-red-500" />
        <span className="font-medium text-gray-800">
          {tFaq(`${faq.key}question`)}
        </span>
      </div>
    ),
    children: (
      <div className="text-gray-600 leading-relaxed pl-6">
        {tFaq(`${faq.key}answer`)}
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
          <p className="text-gray-500 text-lg font-semibold">{t("title")}</p>
          <p className="text-gray-500">{t("description")}</p>
        </div>
      )}
    </div>
  );
};
