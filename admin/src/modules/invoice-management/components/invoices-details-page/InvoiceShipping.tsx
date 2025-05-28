export default function InvoiceShipping() {
    return (
        <div className="flex flex-col justify-between bg-gray-100 rounded-xl p-4 sm:p-6 w-full">
            <h1 className="text-lg sm:text-xl font-semibold mb-4">Giao hàng</h1>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src="/images/products/shipping/ghn.png"
                        alt="GHN"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg"
                    />
                    <span className="text-base sm:text-lg font-medium">GHN Express</span>
                </div>
            </div>
            <button className="mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto">
                Xem chi tiết nhà cung cấp dịch vụ
            </button>
        </div>
    );
}