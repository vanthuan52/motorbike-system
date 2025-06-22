"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

type PolicySection = {
  title: string;
  content: React.ReactNode;
};

export default function PrivacyPolicyAccordion() {
  const t = useTranslations("privacyPolicy");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const sectionKeys = Array.from({ length: 11 }, (_, i) => (i + 1).toString());

  return (
    <div className="py-8">
      <div className="container">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t("title")}
        </h2>
        <div className="space-y-4">
          {sectionKeys.map((key, index) => {
            const title = t(`sections.${key}.title`);
            const content = t.raw(`sections.${key}.content`);
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-sm"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-t-lg flex justify-between items-center"
                >
                  <span className="font-medium text-gray-800">{title}</span>
                  <span className="text-xl text-gray-500">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-4 py-3 bg-gray-50 text-gray-700 space-y-1">
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
