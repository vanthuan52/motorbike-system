"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import FilterSidebar from "./FilterSidebar";
import SortBar from "./SortBar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { SkeletonCard } from "./SkeletonCard";
import ActiveFilters from "./ActiveFilters";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import Drawer from "@/components/ui/Drawer";
import { DEFAULT_PER_PAGE } from "@/constant/application";
import { mockDataTableVehiclePart } from "@/data/TableData";
import { fetchProducts } from "../api/productApi";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { Product } from "@/types/users/products/product";

type StatusType = "in_stock" | "out_of_stock" | "out_of_business";
type FilterState = {
  status: StatusType[];
  price: [number, number];
  categories: string[];
};

export default function ProductListPage() {
  const t = useTranslations(TRANSLATION_FILES.PRODUCT);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const urlCategories = searchParams.getAll("danh-muc");
    return {
      status: [],
      price: [0, 10000000],
      categories: urlCategories.length ? urlCategories : [],
    };
  });

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("danh-muc");
    filters.categories.forEach((cat) => {
      params.append("danh-muc", cat);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.categories]);
  const [sort, setSort] = useState<
    "relevance" | "discount" | "newest" | "price-asc" | "price-desc"
  >("relevance");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { direction: scrollDir, pastThreshold } = useScrollDirection(100);
  const { data, isLoading } = useQuery({
    queryKey: ["products", filters, sort, page, search],
    queryFn: () =>
      fetchProducts({
        ...filters,
        sort,
        page,
        pageSize: DEFAULT_PER_PAGE,
        search,
      }),
  });

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / DEFAULT_PER_PAGE);

  const handleFilterChange = useCallback((next: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  }, []);

  const listVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "static" as const,
      transition: { duration: 0.3, ease: "easeInOut" as const },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -60 : 60,
      opacity: 0,
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transition: { duration: 0.3, ease: "easeInOut" as const },
    }),
  };

  const handlePageChange = (nextPage: number) => {
    setDirection(nextPage > page ? 1 : -1);
    setPage(nextPage);
  };
  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.productList"), href: "/san-pham" },
  ];
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <section className="bg-bg-soft min-h-screen">
      <div className="container">
        <Breadcrumbs
          items={breadcrumbs}
          className="py-5"
          linkClassName="hover:!underline"
          activeClassName="text-white font-bold"
        />
        <h1 className="text-2xl font-bold text-text-primary my-4">
          {t("pageTitle")}
        </h1>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col ">
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="hidden lg:block lg:w-60 flex-shrink-0">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  categories={mockDataTableVehiclePart}
                  search={search}
                  onSearch={handleSearch}
                />
              </aside>
              {/* Drawer for mobile filter — trigger moved to SortBar */}
              <Drawer
                placement="left"
                onClose={() => setSidebarOpen(false)}
                open={sidebarOpen}
                width={320}
              >
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    onChange={handleFilterChange}
                    categories={mockDataTableVehiclePart}
                    search={search}
                    onSearch={handleSearch}
                  />
                </div>
              </Drawer>
              <main className="flex-1 flex flex-col gap-4">
                {/* SortBar: normal flow */}
                <div className="lg:block">
                  <SortBar
                    sort={sort}
                    onChange={setSort}
                    total={total}
                    showing={products.length}
                    layout={layout}
                    onLayoutChange={setLayout}
                    onFilterOpen={() => setSidebarOpen(true)}
                  />
                </div>

                {/* SortBar: fixed on mobile when scrolling up */}
                {pastThreshold && scrollDir === "up" && (
                  <div
                    className="lg:hidden fixed top-0 left-0 right-0 z-40
                               bg-bg-soft/95 backdrop-blur-sm shadow-md
                               px-4 py-2
                               animate-slide-down"
                  >
                    <div className="container">
                      <SortBar
                        sort={sort}
                        onChange={setSort}
                        total={total}
                        showing={products.length}
                        layout={layout}
                        onLayoutChange={setLayout}
                        onFilterOpen={() => setSidebarOpen(true)}
                      />
                    </div>
                  </div>
                )}
                <ActiveFilters filters={filters} setFilters={setFilters} />
                <div className="relative min-h-[350px]">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={page + search + sort + JSON.stringify(filters)}
                      custom={direction}
                      variants={listVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className={
                        layout === "grid"
                          ? "grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                          : "flex flex-col gap-4"
                      }
                    >
                      {isLoading ? (
                        Array.from({ length: DEFAULT_PER_PAGE }).map((_, i) => (
                          <SkeletonCard key={i} />
                        ))
                      ) : products.length === 0 ? (
                        <div className="col-span-full text-center text-text-muted py-10">
                          {t("notFound")}
                        </div>
                      ) : (
                        products.map((p: Product) => (
                          <ProductCard key={p.id} product={p} layout={layout} />
                        ))
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Pagination
              current={page}
              total={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
