"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

type FAQ = {
  questionKey: string;
  answerKey: string;
};

const faqs: FAQ[] = [
  {
    questionKey: "howOften",
    answerKey: "howOftenAnswer",
  },
  {
    questionKey: "needBooking",
    answerKey: "needBookingAnswer",
  },
  {
    questionKey: "warranty",
    answerKey: "warrantyAnswer",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
  t,
}: {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] overflow-hidden transition"
    >
      <button
        onClick={() => onToggle(index)}
        className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
      >
        <h3 className="text-lg font-semibold text-text-primary">
          {`${t(faq.questionKey)}`}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-text-muted" />
        ) : (
          <ChevronDown className="w-6 h-6 text-text-muted" />
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-4 text-sm text-text-secondary"
        >
          {`${t(faq.answerKey)}`}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations(`${TRANSLATION_FILES.SERVICE_PAGE}.faqSection`);

  const buttonRef = useRef(null);
  const isInView = useInView(buttonRef, { once: false });

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-surface-alt">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-10">
          {t("title")}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={toggle}
              t={t}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <motion.div
            ref={buttonRef}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <motion.a
              href="/cau-hoi-thuong-gap"
              className="bg-primary-700 text-white font-semibold px-6 py-3 rounded-full text-lg hover:bg-primary-500 transition shadow-[var(--shadow-primary)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("seeMore")}{" "}
              <motion.span
                className="inline-block transition-transform"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
