"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import FilterSidebar from "./FilterSidebar";
import SortBar from "./SortBar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { mockDataTableVehiclePart } from "@/data/TableData";
import { fetchProducts } from "../api/productApi";
import { SkeletonCard } from "./SkeletonCard";
import ActiveFilters from "./ActiveFilters";
import { Product } from "@/types/users/products/product";
import { useRouter } from "next/navigation";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import SearchBar from "../../danh-muc/_components/SearchBar";
import { DEFAULT_PER_PAGE } from "@/constant/application";
import { TRANSLATION_FILES } from "@/lib/i18n";

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
  const initialCategory = searchParams.get("danh-muc") || "";
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    price: [0, 10000000],
    categories: initialCategory ? [initialCategory] : [],
  });

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("danh-muc");
    filters.categories.forEach((cat) => {
      params.append("danh-muc", cat);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters.categories, searchParams, router]);

  useEffect(() => {
    const urlCategories = searchParams.getAll("danh-muc");
    setFilters((prev) => ({
      ...prev,
      categories: urlCategories.length ? urlCategories : [],
    }));
  }, [searchParams]);
  const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc">(
    "relevance"
  );
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  const listVariants = {
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
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -60 : 60,
      opacity: 0,
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
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
    <section className="bg-bg-soft py-4 min-h-screen">
      <div className="container sm:mx-auto">
        <Breadcrumbs
          items={breadcrumbs}
          className="mb-4"
          linkClassName="hover:!underline"
          activeClassName="text-white font-bold"
          separator="/"
        />
        <SearchBar search={search} handleSearch={handleSearch} />
        <div className="flex flex-col gap-4 py-2">
          <SortBar
            sort={sort}
            onChange={setSort}
            total={total}
            showing={products.length}
            layout={layout}
            onLayoutChange={setLayout}
          />
          <div className="flex flex-col ">
            <div className="flex flex-col lg:flex-row md:gap-6">
              <aside className="hidden lg:block md:w-60 flex-shrink-0">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  categories={mockDataTableVehiclePart}
                />
              </aside>
              <div className="lg:hidden mb-2">
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setSidebarOpen(true)}
                  className="mb-2"
                >
                  {t("filter.open")}
                </Button>
                <Drawer
                  title={t("filter.title")}
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
                    />
                  </div>
                </Drawer>
              </div>
              <main className="flex-1 flex flex-col gap-4">
                <ActiveFilters filters={filters} setFilters={setFilters} />
                <div className="relative min-h-[350px] overflow-hidden">
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
                          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
          <hr className="border-border" />
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
