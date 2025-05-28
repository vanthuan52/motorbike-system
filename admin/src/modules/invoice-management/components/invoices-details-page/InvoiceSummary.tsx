import { Divider } from "antd";
import { formatVND } from "../../utils/formatVND";
import { InvoiceManagement } from "../../types";
export default function InvoiceSummary({ invoice }: { invoice: InvoiceManagement }) {
    return (
        <div className="flex flex-col bg-gray-100 rounded-xl p-4 sm:p-6 w-full">
            <h1 className="text-lg sm:text-xl font-semibold">Tóm tắt hoá đơn</h1>
            <div className="flex justify-between items-center mt-4">
                <p className="text-base font-semibold text-gray-500">Tổng tiền</p>
                <p className="font-semibold text-base sm:text-lg">{formatVND(invoice.total)}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-base font-semibold text-gray-500">Phí vận chuyện</p>
                <p className="font-semibold text-base sm:text-lg">{formatVND(invoice.shipping_fee)}</p>
            </div>
            <Divider />
            <div className="flex justify-between items-center mt-4">
                <p className="text-base font-semibold text-gray-500">Tổng thanh toán</p>
                <p className="font-semibold text-base sm:text-lg">{formatVND(invoice.total + invoice.shipping_fee)}</p>
            </div>
        </div>
    );
}