import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { HiDotsHorizontal } from "react-icons/hi";
import { mockInvoices } from "../mocks/Invoices";
import { mockDataTableManageCustomers } from "../../customer-management/mocks/customer-data";
import { statusColor } from "../utils/constants";
import InvoiceProductList from "../components/invoices-details-page/InvoiceProductList";
import InvoiceSummary from "../components/invoices-details-page/InvoiceSummary";
import InvoiceShipping from "../components/invoices-details-page/InvoiceShipping";
import InvoiceActivity from "../components/invoices-details-page/InvoiceActivity";
import InvoiceCustomerInfo from "../components/invoices-details-page/InvoiceCustomerInfo";
import { Tag } from "antd";

export default function InvoicesDetailsPage() {
  const { id } = useParams();
  const invoice = mockInvoices.find((inv) => inv.id === id);
  const customer = mockDataTableManageCustomers.find(
    (cus) => cus.id === invoice?.customer_id
  );
  if (!invoice) {
    return (
      <div className="text-center text-lg mt-10">Không tìm thấy hóa đơn</div>
    );
  }
  return (
    <div className="mx-2 sm:mx-4 my-10 sm:my-2 px-2 sm:px-3 py-2 transition-all duration-300 rounded-xl bg-white border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row md:items-center md:justify-between gap-2">
          <div>
            <div className="flex gap-3 items-center flex-wrap">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Hoá đơn <span className="text-gray-500">#{invoice.id}</span>
              </h2>
              <Tag
                color={statusColor[invoice.status] || "default"}
                className="text-base font-medium px-3 py-2"
              >
                {invoice.status === "delivered" && "Đã giao"}
                {invoice.status === "pending" && "Chờ xử lý"}
                {invoice.status === "cancelled" && "Đã hủy"}
              </Tag>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {dayjs(invoice.created_at).format("DD/MM/YYYY [lúc] HH:mm")}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <span className="px-1 py-1 bg-gray-200 rounded-sm">
              <HiDotsHorizontal size={20} />
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <InvoiceProductList products={invoice.products} />
            <div className="flex flex-col md:flex-row w-full gap-4">
              <InvoiceSummary invoice={invoice} />
              <InvoiceShipping />
            </div>
            <InvoiceActivity />
          </div>
          {customer && (
            <InvoiceCustomerInfo customer={customer} invoice={invoice} />
          )}
        </div>
      </div>
    </div>
  );
}
