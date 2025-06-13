import { Button, Select, Tag, Divider } from "antd";
import dayjs from "dayjs";
import { InvoiceManagement, Product } from "../../types";
import { IoClose } from "react-icons/io5";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  paymentStatusColor,
  statusColor,
  paymentMethodLabel,
  shippingMethodLabel,
  COLOR_VI,
} from "../../utils/constants";
import { mockDataTableManageCustomers } from "../../../customer-management/mocks/customer-data";
import { formatVND } from "../../utils/formatVND";
import SkeletonDetailPanel from "./SkeletonDetailPanel";
export default function InvoiceDetailPanel({
  selectedRow,
  panelVisible,
  onClose,
  loading,
}: {
  selectedRow: InvoiceManagement | undefined;
  panelVisible: boolean;
  onClose: () => void;
  loading?: boolean;
}) {
  if (!selectedRow) return null;
  return (
    <div
      className={`
                absolute top-0 right-0 h-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full
                sm:min-w-[340px] sm:max-w-[400px] transition-transform duration-300 overflow-auto
                ${panelVisible ? "translate-x-0" : "translate-x-full"}
                ${panelVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
      style={{ willChange: "transform" }}
    >
      {loading ? (
        <SkeletonDetailPanel />
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 border border-gray-200"
              onClick={onClose}
            >
              <IoClose className="cursor-pointer" />
            </button>
            <div className="flex gap-2">
              <Select
                value={selectedRow.status}
                style={{ width: 120 }}
                options={[
                  { value: "delivered", label: "Đã giao" },
                  { value: "pending", label: "Chờ giao" },
                  { value: "cancelled", label: "Đã hủy" },
                ]}
              />
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 border border-gray-200">
                <BiDotsHorizontalRounded className="cursor-pointer" />
              </button>
            </div>
          </div>
          <div className="text-lg font-semibold mb-2">
            {selectedRow.id.toUpperCase()}
          </div>
          <div className="flex flex-col gap-2 mb-4 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Trạng thái thanh toán</span>
              <Tag
                color={paymentStatusColor[selectedRow.payment_status]}
                className="rounded px-3 py-1 text-xs"
              >
                {selectedRow.payment_status === "completed"
                  ? "Hoàn tất"
                  : selectedRow.payment_status === "pending"
                    ? "Chờ xử lý"
                    : "Thất bại"}
              </Tag>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Trạng thái giao hàng</span>
              <Tag
                color={statusColor[selectedRow.status]}
                className="rounded px-3 py-1 text-xs"
              >
                {selectedRow.status === "delivered"
                  ? "Đã giao"
                  : selectedRow.status === "pending"
                    ? "Chờ giao"
                    : "Đã hủy"}
              </Tag>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Khách hàng</span>
              <span className="font-medium">
                {mockDataTableManageCustomers.find(
                  (customer) => customer.id === selectedRow.customer_id
                )?.first_name +
                  " " +
                  mockDataTableManageCustomers.find(
                    (customer) => customer.id === selectedRow.customer_id
                  )?.last_name}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Người nhận</span>
              <span className="font-medium">
                {selectedRow.recipient_name ?? ""}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Ngày giao hàng</span>
              <span>{dayjs(selectedRow.ship_date).format("YYYY-MM-DD")}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Thanh toán</span>
              <span>{paymentMethodLabel[selectedRow.payment_method]}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Vận chuyển</span>
              <span>{shippingMethodLabel[selectedRow.shipping_method]}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Địa chỉ</span>
              <span className="text-right max-w-[160px] truncate">
                {selectedRow.address}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Ngày tạo</span>
              <span>
                {dayjs(selectedRow.created_at).format("YYYY-MM-DD HH:mm")}
              </span>
            </div>
            <div className="flex flex-col justify-between py-1">
              <span className="text-gray-500">Ghi chú</span>
              {selectedRow.note && (
                <div className="bg-gray-50 rounded-lg py-2 mt-2 text-gray-600 border border-gray-300">
                  <span className="p-2 whitespace-pre-line break-words">
                    {selectedRow.note}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-lg p-3 mb-3">
            <div className="font-semibold mb-2">
              Mới ({selectedRow.products.length})
            </div>
            {selectedRow.products.map((p: Product) => (
              <div key={p.id} className="flex items-center mb-2">
                <img
                  src={p.image?.[0]}
                  alt={p.name}
                  className="w-10 h-10 object-cover rounded mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">
                    Màu:{" "}
                    {p.colors && p.colors.length > 0
                      ? p.colors.map((c) => COLOR_VI[c] || c).join(", ")
                      : "—"}
                  </div>
                </div>
                <div className="font-medium text-green-600">
                  {formatVND(p.price)}
                </div>
              </div>
            ))}
            <Divider />
            <div className="flex justify-between text-base font-semibold mt-2">
              <span>Tạm tính</span>
              <span className="font-medium text-green-700">
                {formatVND(selectedRow.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold mt-2">
              <span>Giảm giá</span>
              <span className="font-medium text-red-500">
                {formatVND(selectedRow.discount)}
              </span>
            </div>
            <Divider />
            <div className="flex justify-between text-base font-semibold mt-2">
              <span>Tổng cộng</span>
              <span className="text-green-700 font-medium">
                {formatVND(selectedRow.total)}
              </span>
            </div>
          </div>
          <Button
            type="default"
            block
            onClick={() => window.open(`/invoices/${selectedRow.id}`, "_blank")}
          >
            Xem chi tiết
          </Button>
        </>
      )}
    </div>
  );
}
