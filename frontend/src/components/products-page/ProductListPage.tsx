"use client"
import { useState, useCallback } from "react"
import { Drawer, Button } from "antd"
import { MenuOutlined } from "@ant-design/icons"
import CategoryMenu from "./CategoryMenu"
import FilterSidebar from "./FilterSidebar"
import SortBar from "./SortBar"
import ProductCard from "./ProductCard"
import Pagination from "./Pagination"
import { mockDataTableVehiclePart } from "@/data/TableData"
import { mockProducts } from "@/data/Products"
import ActiveFilters from "./ActiveFilters"

type StatusType = "in_stock" | "out_of_stock" | "out_of_business"
type FilterState = {
    status: StatusType[]
    price: [number, number]
    categories: string[]
}

const PRODUCTS_PER_PAGE = 6

export default function ProductListPage() {
    const [filters, setFilters] = useState<FilterState>({
        status: [],
        price: [0, 10000000],
        categories: []
    })

    const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc">('relevance')
    const [layout, setLayout] = useState<"grid" | "list">("grid")
    const [page, setPage] = useState(1)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleFilterChange = useCallback((next: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...next }))
        setPage(1)
    }, [])
    const handleCategoryChange = (categoryId: string) => {
        setFilters(prev => {
            const exists = prev.categories.includes(categoryId)
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter(id => id !== categoryId)
                    : [...prev.categories, categoryId]
            }
        })
        setPage(1)
    }
    const filteredProducts = mockProducts.filter(p => {
        const [min, max] = filters.price
        const matchStatus = filters.status.length === 0 || filters.status.includes(p.status)
        const matchPrice = p.price >= min && p.price <= max
        const matchCategory = filters.categories.length === 0 || filters.categories.includes(p.category_id)
        return matchStatus && matchPrice && matchCategory
    })

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price
        if (sort === "price-desc") return b.price - a.price
        return 0
    })

    const total = sortedProducts.length
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE)
    const pagedProducts = sortedProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE
    )

    return (
        <section className="bg-gray-100 py-4 min-h-screen">
            <div className="container mx-auto px-2 sm:px-4">
                <div className="flex flex-col gap-4">
                    <CategoryMenu categories={mockDataTableVehiclePart} onCategoryClick={handleCategoryChange}
                        selectedCategories={filters.categories} />
                    <hr className="border-gray-200" />
                    <SortBar
                        sort={sort}
                        onChange={setSort}
                        total={total}
                        showing={pagedProducts.length}
                        layout={layout}
                        onLayoutChange={setLayout}
                    />
                    <div className="flex flex-col ">
                        <div className="flex flex-col md:flex-row md:gap-6">
                            <aside className="hidden md:block md:w-80 flex-shrink-0">
                                <FilterSidebar
                                    filters={filters}
                                    onChange={handleFilterChange}
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
                                    bodyStyle={{ padding: 0 }}
                                >
                                    <div className="p-4">
                                        <FilterSidebar
                                            filters={filters}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                </Drawer>
                            </div>
                            <main className="flex-1 flex flex-col gap-4">
                                {/* filter map */}
                                <ActiveFilters filters={filters} setFilters={setFilters} />
                                <div
                                    className={
                                        layout === "grid"
                                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                            : "flex flex-col gap-4"
                                    }
                                >
                                    {pagedProducts.length === 0 ? (
                                        <div className="col-span-full text-center text-gray-500 py-10">
                                            Không có sản phẩm phù hợp.
                                        </div>
                                    ) : (
                                        pagedProducts.map(p => (
                                            <ProductCard key={p.id} product={p} layout={layout} />
                                        ))
                                    )}
                                </div>
                            </main>
                        </div>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-center mt-4">
                        <Pagination
                            current={page}
                            total={totalPages}
                            onChange={setPage}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}