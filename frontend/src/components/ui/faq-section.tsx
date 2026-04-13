"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "@/components/ui/section-heading";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  items: FaqItem[];
  /** Link "Xem thêm" — if omitted, the link is hidden */
  seeMoreHref?: string;
  seeMoreLabel?: string;
  className?: string;
}

function FaqItemRow({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: (i: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`border rounded-2xl transition-all duration-300 ${
        isOpen
          ? "bg-white border-primary-200 shadow-md shadow-primary-500/5"
          : "bg-white border-gray-100 hover:border-primary-100 hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => onToggle(index)}
        className="flex justify-between items-center w-full p-6 text-left focus:outline-none gap-4"
        aria-expanded={isOpen}
      >
        <h3
          className={`text-lg font-medium transition-colors duration-300 ${
            isOpen ? "text-primary-700" : "text-gray-900"
          }`}
        >
          {item.question}
        </h3>
        <div
          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
            isOpen
              ? "bg-primary-100 text-primary-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <Plus
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 text-text-secondary leading-relaxed border-t border-gray-100/50 mt-2">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection({
  title = "Câu Hỏi Thường Gặp (FAQ)",
  items,
  seeMoreHref,
  seeMoreLabel = "Xem thêm",
  className = "",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container max-w-4xl">
        <SectionHeading title={title} className="mb-16" />

        <div className="space-y-4">
          {items.map((item, index) => (
            <FaqItemRow
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={toggle}
            />
          ))}
        </div>

        {seeMoreHref && (
          <div className="flex justify-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href={seeMoreHref}
                className="inline-flex items-center gap-2 text-primary-600 font-semibold text-lg hover:text-primary-800 transition-colors group"
              >
                {seeMoreLabel}
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
