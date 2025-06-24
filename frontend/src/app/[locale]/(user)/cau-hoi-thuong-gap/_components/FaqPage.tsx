"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { faqData } from "@/data/FaqData";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { FAQList } from "./FAQList";
import { ContactCTA } from "./ContactCTA";
import Banner from "./Banner";

export default function FaqPage() {
  const t = useTranslations("faqPage.categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

  const filteredFAQs = faqData.filter((faq) => {
    const matchCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
  console.log(selectedCategory);

  console.log(filteredFAQs);

  return (
    <section className="w-full">
      <Banner />
      <div className="container py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="px-6 md:px-12 lg:px-20">
          <FAQList
            filteredFAQs={filteredFAQs}
            expandedPanels={expandedPanels}
            setExpandedPanels={setExpandedPanels}
          />
        </div>
        <ContactCTA />
      </div>
    </section>
  );
}
