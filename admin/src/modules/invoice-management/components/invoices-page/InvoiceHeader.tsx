import { Button, Input, Select } from "antd";
import { CgExport } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

type InvoiceHeaderProps = {
  search: string;
  setSearch: (value: string) => void;
  payment: string | undefined;
  setPayment: (value: string) => void;
  paymentMethod: string | undefined;
  setPaymentMethod: (value: string) => void;
  shippingMethod: string | undefined;
  setShippingMethod: (value: string) => void;
  onCreateInvoice?: () => void;
  handleExportExcel?: () => void;
};

export default function InvoiceHeader({
  search,
  setSearch,
  payment,
  setPayment,
  paymentMethod,
  setPaymentMethod,
  shippingMethod,
  setShippingMethod,
}: InvoiceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 w-full">
      <Input
        placeholder="Tìm kiếm hóa đơn, khách hàng, sản phẩm..."
        prefix={<FiSearch />}
        allowClear
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-64 !h-10"
      />
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Select
          placeholder="Trạng thái thanh toán"
          allowClear
          value={payment || undefined}
          onChange={setPayment}
          options={[
            { value: "completed", label: "Hoàn tất" },
            { value: "pending", label: "Chờ xử lý" },
            { value: "failed", label: "Thất bại" },
          ]}
          className="w-full sm:w-42 !h-10 [&>.ant-select-selector]:!h-10 [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center"
        />

        <Select
          placeholder="Phương thức thanh toán"
          allowClear
          value={paymentMethod || undefined}
          onChange={setPaymentMethod}
          options={[
            { value: "cod", label: "COD" },
            { value: "bank_transfer", label: "Chuyển khoản" },
            { value: "momo", label: "Momo" },
            { value: "credit_card", label: "Thẻ tín dụng" },
          ]}
          className="w-full sm:w-40 !h-10 [&>.ant-select-selector]:!h-10 [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center"
        />

        <Select
          placeholder="Phương thức vận chuyển"
          allowClear
          value={shippingMethod || undefined}
          onChange={setShippingMethod}
          options={[
            { value: "ghtk", label: "GHTK" },
            { value: "ghn", label: "GHN" },
            { value: "viettel_post", label: "Viettel Post" },
            { value: "vnpost", label: "VNPost" },
            { value: "ahamove", label: "Ahamove" },
            { value: "grabexpress", label: "GrabExpress" },
            { value: "nowship", label: "NowShip" },
            { value: "jtexpress", label: "J&T Express" },
            { value: "ninjavan", label: "Ninja Van" },
            { value: "shop_delivery", label: "Shop Delivery" },
            { value: "pickup_at_store", label: "Nhận tại cửa hàng" },
          ]}
          className="w-full sm:w-48 !h-10 [&>.ant-select-selector]:!h-10 [&>.ant-select-selector]:!flex [&>.ant-select-selector]:!items-center"
        />
      </div>
    </div>
  );
}
