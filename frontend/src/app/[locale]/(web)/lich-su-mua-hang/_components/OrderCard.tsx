"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  CreditCard,
  Truck,
  StickyNote,
  Package,
  CalendarDays,
} from "lucide-react";

import { InvoiceManagement } from "../types";
import { IMG_PLACEHOLDER } from "@/constant/application";

/* ── Status config ── */
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  delivered: {
    label: "Đã giao",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Đang xử lý",
    color: "text-amber-700",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
};

const PAYMENT_MAP: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  bank_transfer: "Chuyển khoản",
  momo: "Ví MoMo",
  credit_card: "Thẻ tín dụng",
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  completed: { label: "Đã thanh toán", color: "text-emerald-600" },
  pending: { label: "Chờ thanh toán", color: "text-amber-600" },
  failed: { label: "Thất bại", color: "text-red-600" },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface Props {
  order: InvoiceManagement;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function OrderCard({ order, isExpanded, onToggle }: Props) {
  const status = STATUS_MAP[order.status] || STATUS_MAP.pending;

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden transition-shadow hover:shadow-md">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 text-left cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: order info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className="text-sm font-bold text-text-primary font-mono">
                #{order.id}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <CalendarDays size={12} />
                {formatDate(order.createdAt)}
              </span>
              <span>{order.products.length} sản phẩm</span>
            </div>
          </div>

          {/* Center: product thumbnails */}
          <div className="flex items-center gap-0 -space-x-2">
            {order.products.slice(0, 4).map((p, idx) => (
              <div
                key={p.id}
                className="relative w-10 h-10 rounded-lg overflow-hidden bg-bg-soft border-2 border-surface"
                style={{ zIndex: 10 - idx }}
              >
                <Image
                  src={p.image?.[0] || IMG_PLACEHOLDER}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ))}
            {order.products.length > 4 && (
              <span className="w-10 h-10 rounded-lg bg-bg-soft border-2 border-surface flex items-center justify-center text-xs font-bold text-text-muted">
                +{order.products.length - 4}
              </span>
            )}
          </div>

          {/* Right: total + expand icon */}
          <div className="flex items-center gap-3 sm:min-w-[160px] sm:justify-end">
            <div className="sm:text-right">
              <p className="text-xs text-text-muted">Tổng tiền</p>
              <p className="text-base font-bold text-text-primary">
                {order.total.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center bg-bg-soft transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={16} className="text-text-muted" />
            </div>
          </div>
        </div>
      </button>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <hr className="border-border mb-5" />

              {/* Order details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-soft">
                  <MapPin size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Địa chỉ</p>
                    <p className="text-sm text-text-primary">{order.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-soft">
                  <CreditCard size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Thanh toán</p>
                    <p className="text-sm text-text-primary">
                      {PAYMENT_MAP[order.paymentMethod] || order.paymentMethod}
                      {" · "}
                      <span className={PAYMENT_STATUS_MAP[order.paymentStatus]?.color}>
                        {PAYMENT_STATUS_MAP[order.paymentStatus]?.label}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-soft">
                  <Truck size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Vận chuyển</p>
                    <p className="text-sm text-text-primary">
                      {order.shippingMethod} · Phí:{" "}
                      {order.shippingFee?.toLocaleString("vi-VN") || "Miễn phí"}₫
                    </p>
                  </div>
                </div>

                {order.note && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-soft">
                    <StickyNote size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Ghi chú</p>
                      <p className="text-sm text-text-primary">{order.note}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Products list */}
              <div>
                <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1.5">
                  <Package size={14} className="text-primary-500" />
                  Sản phẩm ({order.products.length})
                </p>
                <div className="space-y-2">
                  {order.products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                        <Image
                          src={p.image?.[0] || IMG_PLACEHOLDER}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary line-clamp-1">
                          {p.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {p.price.toLocaleString("vi-VN")}₫ × {p.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                        {(p.price * p.quantity).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals summary */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-muted">Tạm tính</span>
                  <span className="text-text-primary">
                    {order.subtotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-muted">Giảm giá</span>
                    <span className="text-success">
                      -{order.discount.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-muted">Phí vận chuyển</span>
                  <span className="text-text-primary">
                    {order.shippingFee?.toLocaleString("vi-VN") || "0"}₫
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span className="text-text-primary">Tổng cộng</span>
                  <span className="text-primary-500">
                    {order.total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
