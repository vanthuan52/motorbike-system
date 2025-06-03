import { useState, useCallback, useEffect } from "react"
import { Drawer, Button } from "antd"
import { MenuOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import FilterSidebar from "./FilterSidebar"
import SortBar from "./SortBar"
import ProductCard from "./ProductCard"
import Pagination from "./Pagination"
import { mockDataTableVehiclePart } from "@/data/TableData"
import { fetchProducts } from "../api/productApi"
import clsx from "clsx";
import { SkeletonCard } from "./SkeletonCard";
import ActiveFilters from "./ActiveFilters";
import { Product } from "@/types/users/products/product";
import { useRouter } from "next/navigation";

type StatusType = "in_stock" | "out_of_stock" | "out_of_business"
type FilterState = {
    status: StatusType[]
    price: [number, number]
    categories: string[]
}

const PRODUCTS_PER_PAGE = 6

export default function ProductListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("danh-muc") || "";
    const [filters, setFilters] = useState<FilterState>({
        status: [],
        price: [0, 10000000],
        categories: initialCategory ? [initialCategory] : []
    });

    useEffect(() => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.delete("danh-muc");
        filters.categories.forEach(cat => {
            params.append("danh-muc", cat);
        });
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [filters.categories, searchParams, router]);

    useEffect(() => {
        const urlCategories = searchParams.getAll("danh-muc");
        setFilters(prev => ({
            ...prev,
            categories: urlCategories.length ? urlCategories : []
        }));
    }, [searchParams]);
    const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc">('relevance')
    const [layout, setLayout] = useState<"grid" | "list">("grid")
    const [page, setPage] = useState(1)
    const [direction, setDirection] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [search, setSearch] = useState("");
    const { data, isLoading } = useQuery({
        queryKey: ["products", filters, sort, page, search],
        queryFn: () =>
            fetchProducts({
                ...filters,
                sort,
                page,
                pageSize: PRODUCTS_PER_PAGE,
                search,
            }),
    });

    const products = data?.products || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

    const handleFilterChange = useCallback((next: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...next }))
        setPage(1)
    }, [])

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

    // Pagination handler with direction
    const handlePageChange = (nextPage: number) => {
        setDirection(nextPage > page ? 1 : -1);
        setPage(nextPage);
    };

    return (
        <section className="bg-gray-100 py-4 min-h-screen">
            <div className="container sm:mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-left">
                    Danh sách sản phẩm
                </h1>
                <div
                    className={clsx(
                        "flex items-center gap-2 px-3 py-2 mb-4",
                        "bg-white rounded-[30px] shadow max-w-md mx-auto border border-transparent",
                        "transition-all duration-300",
                        "hover:border-orange-400 hover:shadow-lg hover:max-w-xl",
                        "focus-within:border-orange-400 focus-within:shadow-lg focus-within:max-w-xl"
                    )}
                >
                    <FiSearch className="text-gray-400 text-xl transition-colors duration-200 group-hover:text-orange-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 outline-none bg-transparent text-base"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <SortBar
                        sort={sort}
                        onChange={setSort}
                        total={total}
                        showing={products.length}
                        layout={layout}
                        onLayoutChange={setLayout}
                    />
                    <div className="flex flex-col ">
                        <div className="flex flex-col md:flex-row md:gap-6">
                            <aside className="hidden md:block md:w-80 flex-shrink-0">
                                <FilterSidebar
                                    filters={filters}
                                    onChange={handleFilterChange}
                                    categories={mockDataTableVehiclePart}
                                />
                            </aside>
                            <div className="md:hidden mb-2">
                                <Button
                                    icon={<MenuOutlined />}
                                    onClick={() => setSidebarOpen(true)}
                                    className="mb-2"
                                >
                                    Bộ lọc
                                </Button>
                                <Drawer
                                    title="Bộ lọc sản phẩm"
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
                                <div className="relative min-h-[400px] overflow-hidden">
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
                                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                                    : "flex flex-col gap-4"
                                            }
                                        >
                                            {isLoading ? (
                                                Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                                                    <SkeletonCard key={i} />
                                                ))
                                            ) : products.length === 0 ? (
                                                <div className="col-span-full text-center text-gray-500 py-10">
                                                    Không có sản phẩm phù hợp.
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
                    <hr className="border-gray-200" />
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
    )
}