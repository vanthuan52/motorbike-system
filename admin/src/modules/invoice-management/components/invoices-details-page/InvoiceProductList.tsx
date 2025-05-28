import { Divider } from "antd";
import { COLOR_VI } from "../../utils/constants";
import { formatVND } from "../../utils/formatVND";
import { ProductInvoice } from "../../types";

export default function InvoiceProductList({ products }: { products: ProductInvoice[] }) {
    return (
        <div className="flex flex-col bg-gray-100 rounded-xl p-4 sm:p-6 w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg sm:text-xl font-semibold">Hoá đơn của khách hàng</h1>
            </div>
            <div className="max-h-[300px] overflow-auto">
                {products.map((p) => (
                    <div key={p.id}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex gap-2 items-center w-full">
                                <img
                                    src={p.image?.[0]}
                                    alt={p.name}
                                    className="w-20 h-20 object-contain rounded-[20px] mr-0 sm:mr-3 max-w-full"
                                />
                                <div className="flex flex-col">
                                    <div className="font-semibold text-base sm:text-lg">{p.name}</div>
                                    <div className="text-gray-500 text-sm max-w-[400px] truncate">Mô tả: {p.description}</div>
                                    <div className="text-gray-500 text-sm max-w-[400px] truncate">
                                        Màu sắc: {p.colors && p.colors.length > 0
                                            ? p.colors.map(c => COLOR_VI[c] || c).join(", ")
                                            : "—"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 sm:gap-96 w-full">
                                <div className="font-semibold text-base sm:text-lg">{p.quantity}</div>
                                <div className="font-semibold text-base sm:text-lg whitespace-nowrap">{formatVND(p.price)}</div>
                            </div>
                        </div>
                        <Divider className="my-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}