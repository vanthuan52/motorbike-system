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
        <QuestionCircleOutlined className="text-primary-700" />
        <span className="font-medium text-text-primary">
          {t(`faqs.${faq.key}question`)}
        </span>
      </div>
    ),
    children: (
      <div className="text-text-secondary leading-relaxed pl-6">
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
          className="bg-surface"
          style={{ border: "none", background: "transparent" }}
          expandIconPosition="end"
        />
      ) : (
        <div className="text-center py-12">
          <QuestionCircleOutlined className="text-4xl text-text-muted mb-4" />
          <p className="text-text-muted text-lg font-semibold">
            {t("noResults.title")}
          </p>
          <p className="text-text-muted">{t("noResults.description")}</p>
        </div>
      )}
    </div>
  );
};
