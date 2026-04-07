"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function PrivacyPolicyAccordion() {
  const t = useTranslations(TRANSLATION_FILES.PRIVACY_POLICY);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const sectionKeys = Array.from({ length: 9 }, (_, i) => (i + 1).toString());

  return (
    <div className="py-8">
      <div className="container">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          {t("title")}
        </h2>
        <div className="space-y-4">
          {sectionKeys.map((key, index) => {
            const title = t(`sections.${key}.title`);
            const content = t.raw(`sections.${key}.content`);
            return (
              <div
                key={index}
                className="border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-4 py-3 bg-surface hover:bg-surface-alt rounded-t-[var(--radius-lg)] flex justify-between items-center cursor-pointer transition-colors duration-150"
                >
                  <span className="font-medium text-text-primary">{title}</span>
                  <span className="text-xl text-text-muted">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-4 py-3 bg-surface-alt text-text-secondary space-y-1">
                    {Array.isArray(content) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {content.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{content}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
