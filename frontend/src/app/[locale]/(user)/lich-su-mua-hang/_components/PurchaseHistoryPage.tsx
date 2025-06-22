"use client";

import { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import { mockInvoices } from "../mocks/Invoices";
import type { InvoiceManagement } from "../types";
import PurchaseFilter from "./PurchaseFilter";
import PurchaseSearchSort from "./PurchaseSearchSort";
import PurchaseList from "./PurchaseList";
import Pagination from "./Pagination";

const PAGE_SIZE = 5;

export default function PurchaseHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<InvoiceManagement[]>([]);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orderDateFrom, setOrderDateFrom] = useState<string>("");
  const [orderDateTo, setOrderDateTo] = useState<string>("");
  const [shipDateFrom, setShipDateFrom] = useState<string>("");
  const [shipDateTo, setShipDateTo] = useState<string>("");

  const [filterOpen, setFilterOpen] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockInvoices.filter((o) => o.customer_id === "cus-01");
      setOrders(filtered);
      setLoading(false);
    }, 800);
  }, []);
  useEffect(() => {
    if (page === 1) return;
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [page]);
  let filteredOrders = orders.filter((order) => {
    // Search by order id
    if (
      searchText &&
      !order.id.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false;
    }
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    // Order date filter
    if (orderDateFrom && new Date(order.created_at) < new Date(orderDateFrom)) {
      return false;
    }
    if (orderDateTo && new Date(order.created_at) > new Date(orderDateTo)) {
      return false;
    }
    // Ship date filter
    if (shipDateFrom && new Date(order.ship_date) < new Date(shipDateFrom)) {
      return false;
    }
    if (shipDateTo && new Date(order.ship_date) > new Date(shipDateTo)) {
      return false;
    }
    return true;
  });

  filteredOrders = filteredOrders.sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    if (sortBy === "oldest") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    if (sortBy === "price_desc") {
      return b.total - a.total;
    }
    if (sortBy === "price_asc") {
      return a.total - b.total;
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const pagedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="py-8 min-h-screen">
      <div className="container">
        <div className="block md:hidden mb-3">
          <Button
            type="primary"
            className="!bg-black"
            onClick={() => setFilterOpen(true)}
          >
            Lọc đơn hàng
          </Button>
          <Drawer
            title="Bộ lọc đơn hàng"
            placement="left"
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            width={320}
          >
            <PurchaseFilter
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              orderDateFrom={orderDateFrom}
              setOrderDateFrom={setOrderDateFrom}
              orderDateTo={orderDateTo}
              setOrderDateTo={setOrderDateTo}
              shipDateFrom={shipDateFrom}
              setShipDateFrom={setShipDateFrom}
              shipDateTo={shipDateTo}
              setShipDateTo={setShipDateTo}
              setPage={setPage}
            />
          </Drawer>
        </div>
        <div className="hidden md:block">
          <PurchaseFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            orderDateFrom={orderDateFrom}
            setOrderDateFrom={setOrderDateFrom}
            orderDateTo={orderDateTo}
            setOrderDateTo={setOrderDateTo}
            shipDateFrom={shipDateFrom}
            setShipDateFrom={setShipDateFrom}
            shipDateTo={shipDateTo}
            setShipDateTo={setShipDateTo}
            setPage={setPage}
          />
        </div>
        <PurchaseSearchSort
          searchText={searchText}
          setSearchText={setSearchText}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setPage={setPage}
        />
        <div className="space-y-4">
          <PurchaseList
            loading={loading}
            orders={pagedOrders}
            expanded={expanded}
            setExpanded={setExpanded}
            PAGE_SIZE={PAGE_SIZE}
          />
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}
