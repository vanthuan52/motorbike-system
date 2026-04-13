"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { TRANSLATION_FILES } from "@/lib/i18n";
import { mockInvoices } from "../mocks/Invoices";
import type { InvoiceManagement } from "../types";
import OrderCard from "./order-card";

const PAGE_SIZE = 5;

export default function PurchaseHistoryPage() {
  const t = useTranslations(TRANSLATION_FILES.ORDER_SUCCESS);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<InvoiceManagement[]>([]);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Trang Chủ", href: "/" },
    { label: "Lịch Sử Mua Hàng" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOrders(mockInvoices.filter((o) => o.customerId === "cus-01"));
      setLoading(false);
    }, 600);
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.products.some((p) => p.name.toLowerCase().includes(q)),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "price_desc") return b.total - a.total;
      if (sortBy === "price_asc") return a.total - b.total;
      return 0;
    });

    return result;
  }, [orders, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const pagedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const statusTabs = [
    { value: "all", label: "Tất cả", count: orders.length },
    {
      value: "pending",
      label: "Đang xử lý",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      value: "delivered",
      label: "Đã giao",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  return (
    <div className="bg-bg-soft min-h-screen">
      {/* Breadcrumb */}
      <div className="container pt-5">
        <Breadcrumbs
          items={breadcrumbs}
          className="pb-6"
          linkClassName="hover:!underline"
          activeClassName="text-text-primary font-semibold"
        />
      </div>

      <div className="container pb-16">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
          Lịch Sử Mua Hàng
        </h1>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer
                ${
                  statusFilter === tab.value
                    ? "bg-primary-500 text-white shadow-sm"
                    : "bg-surface border border-border text-text-secondary hover:border-primary-300 hover:text-primary-500"
                }
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 text-xs ${
                    statusFilter === tab.value
                      ? "text-white/80"
                      : "text-text-muted"
                  }`}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="h-10 pl-9 pr-8 rounded-lg border border-border bg-surface text-sm text-text-primary appearance-none cursor-pointer focus:border-primary-500 outline-none transition-all"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_desc">Giá cao → thấp</option>
              <option value="price_asc">Giá thấp → cao</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
          </div>
        </div>

        {/* Order list */}
        <div className="space-y-4">
          {loading ? (
            // Skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface rounded-2xl border border-border p-5 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary-100 rounded w-32" />
                    <div className="h-3 bg-secondary-50 rounded w-24" />
                  </div>
                  <div className="h-6 bg-secondary-100 rounded-full w-20" />
                </div>
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-secondary-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-secondary-100 rounded w-3/4" />
                    <div className="h-3 bg-secondary-50 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : pagedOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-bg-soft flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-text-muted" />
              </div>
              <p className="text-text-primary font-semibold mb-1">
                Không tìm thấy đơn hàng
              </p>
              <p className="text-sm text-text-muted">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          ) : (
            pagedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expanded === order.id}
                onToggle={() =>
                  setExpanded(expanded === order.id ? null : order.id)
                }
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${
                    page === i + 1
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-surface border border-border text-text-secondary hover:border-primary-300"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
