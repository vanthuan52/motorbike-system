"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { mockCategories } from "../mocks/Categories";
import CategoryList from "./CategoryList";
import Pagination from "./Pagination";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import PageHeading from "./PageHeading";
import SearchBar from "./SearchBar";

const PAGE_SIZE = 20;

export default function CategoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [search, page]);

  const filteredCategories = useMemo(
    () =>
      mockCategories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
  const pagedCategories = filteredCategories.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    setDirection(0);
  };

  // Breadcrumbs data
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Danh mục phụ tùng" },
  ];

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          backgroundImage: `url("/images/motorbike/category-banner.webp")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-full h-auto sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] flex items-center"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 text-white">
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-4"
            listClassName="text-white"
            itemClassName="text-white"
            linkClassName="hover:!underline"
            activeClassName="text-white font-bold"
            separator="/"
          />
          <PageHeading />
        </div>
      </motion.div>

      <div className="container sm:mx-auto px-8 sm:px-0 py-2 md:py-4">
        <SearchBar search={search} handleSearch={handleSearch} />
        <CategoryList
          loading={loading}
          pagedCategories={pagedCategories}
          direction={direction}
          search={search}
          PAGE_SIZE={PAGE_SIZE}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          loading={loading}
          setPage={setPage}
          setDirection={setDirection}
        />
      </div>
    </div>
  );
}
