"use client";
import { useState } from "react";
import { faqData } from "@/data/FaqData";
import { SearchBar } from "./_components/SearchBar";
import { CategoryFilter } from "./_components/CategoryFilter";
import { FAQList } from "./_components/FAQList";
import { ContactCTA } from "./_components/ContactCTA";
import Banner from "./_components/Banner";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

  const filteredFAQs = faqData.filter(faq => {
    const matchCategory =
      selectedCategory === "Tất cả" || faq.category === selectedCategory;
    const matchSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className='w-full'>
      <Banner />
      <div className='container py-16'>
        <div className='flex justify-center'>
          <div className='w-full max-w-xl'>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className='px-6 md:px-12 lg:px-20'>
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
