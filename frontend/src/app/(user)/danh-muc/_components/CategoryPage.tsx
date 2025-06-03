"use client";
import { useState, useMemo, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import clsx from "clsx";
import { mockCategories } from "../mocks/Categories";
import CategoryList from "./CategoryList";
import Pagination from "./Pagination";

const PAGE_SIZE = 6;

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

    return (
        <div className="container sm:mx-auto px-8 sm:px-0 py-2 md:py-4">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Danh mục phụ tùng xe máy
            </h1>

            <div
                className={clsx(
                    "flex items-center gap-2 mb-8 px-3 py-2",
                    "bg-white rounded-[30px] shadow max-w-md mx-auto border border-transparent",
                    "transition-all duration-300",
                    "hover:border-orange-400 hover:shadow-lg hover:max-w-xl",
                    "focus-within:border-orange-400 focus-within:shadow-lg focus-within:max-w-xl"
                )}
            >
                <FiSearch className="text-gray-400 text-xl transition-colors duration-200 group-hover:text-orange-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm danh mục phụ tùng..."
                    value={search}
                    onChange={handleSearch}
                    className="flex-1 outline-none bg-transparent text-base"
                />
            </div>

            <CategoryList
                loading={loading}
                pagedCategories={pagedCategories}
                direction={direction}
                search={search}
                PAGE_SIZE={PAGE_SIZE}
            />

            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    loading={loading}
                    setPage={setPage}
                    setDirection={setDirection}
                />
            )}
        </div>
    );
}