import { FaChevronDown, FaChevronUp, FaMoneyBillAlt } from "react-icons/fa";
import Image from "next/image";
import { Tooltip } from "antd";
import {
  FaMoneyBillWave,
  FaTruck,
  FaRegStickyNote,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { InvoiceManagement } from "../types";
import { IMG_PLACEHOLDER } from "@/constant/application";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> =
  {
    delivered: { label: "Đã giao", color: "text-success", bg: "bg-success-bg" },
    pending: {
      label: "Đang xử lý",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    cancelled: { label: "Đã hủy", color: "text-error", bg: "bg-error-bg" },
  };

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface Props {
  order: InvoiceManagement;
  expanded: string | null;
  setExpanded: (v: string | null) => void;
}

export default function PurchaseCard({ order, expanded, setExpanded }: Props) {
  const isExpanded = expanded === order.id;
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-blue-100 transition hover:shadow-xl mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[order.status].bg} ${STATUS_MAP[order.status].color}`}
            >
              {STATUS_MAP[order.status].label}
            </span>
            <span className="font-semibold text-lg">
              Mã đơn: <span className="text-primary-500">{order.id}</span>
            </span>
          </div>
          <div className="text-text-muted text-base mt-1">
            Ngày đặt: {formatDate(order.createdAt)}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 min-w-[120px]">
          <div className="flex -space-x-2 mb-2 items-center justify-center">
            {order.products.slice(0, 3).map((p, idx) => (
              <Image
                key={p.id}
                src={p.image?.[0] || IMG_PLACEHOLDER}
                width={56}
                height={56}
                alt={p.name}
                className="rounded border border-border-strong object-cover bg-secondary-100 shadow-sm"
                style={{ zIndex: 10 - idx }}
              />
            ))}
            {order.products.length > 3 && (
              <span className="w-8 h-8 flex items-center justify-center bg-secondary-200 rounded-full text-xs font-semibold border border-border-strong">
                +{order.products.length - 3}
              </span>
            )}
          </div>
          <div className="sm:text-right min-w-[100px] gap-2 flex flex-row sm:flex-col items-center justify-center">
            <div className="text-text-muted text-base">Tổng tiền</div>
            <div className="text-lg font-bold">
              {order.total.toLocaleString("vi-VN")} vnđ
            </div>
            <Tooltip title={isExpanded ? "Thu gọn" : "Xem chi tiết"}>
              <button
                className={`ml-2 p-2 rounded-full border border-primary-100 hover:bg-primary-50 transition block sm:hidden`}
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                aria-label={isExpanded ? "Thu gọn" : "Xem chi tiết"}
              >
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </Tooltip>
          </div>
          <Tooltip title={isExpanded ? "Thu gọn" : "Xem chi tiết"}>
            <button
              className={`ml-2 p-2 rounded-full border border-primary-100 hover:bg-primary-50 transition hidden sm:block`}
              onClick={() => setExpanded(isExpanded ? null : order.id)}
              aria-label={isExpanded ? "Thu gọn" : "Xem chi tiết"}
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </Tooltip>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expand"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-text-disabled" />{" "}
                  <span>{order.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaRegStickyNote className="text-text-disabled" />{" "}
                  <span>{order.note || "Không có ghi chú"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-text-disabled" />{" "}
                  <span>ĐVVC: {order.shippingMethod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCreditCard className="text-text-disabled" />{" "}
                  <span>
                    Thanh toán: {order.paymentMethod} (
                    {order.paymentStatus === "completed"
                      ? "Đã thanh toán"
                      : order.paymentStatus === "pending"
                        ? "Chờ thanh toán"
                        : "Thất bại"}
                    )
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-text-disabled" />{" "}
                  <span>
                    Phí ship: {order.shippingFee?.toLocaleString("vi-VN") || 0}{" "}
                    vnđ
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMoneyBillAlt className="text-text-disabled" />{" "}
                  <span>
                    Giảm giá: {order.discount.toLocaleString("vi-VN")} vnđ
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Ngày giao: {formatDate(order.shipDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    Lấy hàng:{" "}
                    {order.pickupTime ? formatDate(order.pickupTime) : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <a
                    href="#"
                    className="text-success text-xs font-medium hover:underline"
                  >
                    Theo dõi đơn
                  </a>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2 text-text-primary">Sản phẩm</div>
                <div className="space-y-2">
                  {order.products.map((p) => (
                    <div
                      key={p.id}
                      className="flex gap-3 items-center bg-bg-soft rounded-lg p-2"
                    >
                      <Image
                        src={p.image?.[0] || IMG_PLACEHOLDER}
                        width={56}
                        height={56}
                        alt={p.name}
                        className="w-14 h-14 rounded border object-cover bg-secondary-100"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                      </div>
                      <div className="text-right min-w-[90px]">
                        <div className="font-semibold">
                          {p.price.toLocaleString("vi-VN")} vnđ x {p.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
