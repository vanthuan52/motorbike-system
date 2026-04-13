import { useTranslations } from "next-intl";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { FAQItem } from "@/data/FaqData";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { cn } from "@/utils/common.utils";

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
  const togglePanel = (key: string) => {
    if (expandedPanels.includes(key)) {
      setExpandedPanels(expandedPanels.filter((k) => k !== key));
    } else {
      setExpandedPanels([key]); // accordion mode: only one open
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {filteredFAQs.length > 0 ? (
        filteredFAQs.map((faq) => {
          const isExpanded = expandedPanels.includes(faq.key);
          return (
            <div
              key={faq.key}
              className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => togglePanel(faq.key)}
                className="w-full flex items-center justify-between p-5 text-left bg-surface hover:bg-bg-soft transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className="flex items-center gap-3 pr-4">
                  <HelpCircle className="text-primary-600 shrink-0" size={20} />
                  <span className="font-medium text-text-primary text-base">
                    {t(`faqs.${faq.key}question`)}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "text-text-muted shrink-0 transition-transform duration-300",
                    isExpanded ? "rotate-180" : ""
                  )}
                  size={20}
                />
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="p-5 pt-0 text-text-secondary leading-relaxed pl-12 border-t border-border/50">
                  {t(`faqs.${faq.key}answer`)}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <HelpCircle className="text-text-muted mb-4 mx-auto" size={40} />
          <p className="text-text-muted text-lg font-semibold">
            {t("noResults.title")}
          </p>
          <p className="text-text-muted">{t("noResults.description")}</p>
        </div>
      )}
    </div>
  );
};
