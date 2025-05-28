import { ConfigProvider, Steps, Select } from "antd";

export default function InvoiceActivity() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#a3a3a3",
                    colorText: "#374151",
                    colorBgContainer: "#f3f4f6",
                },
                components: {
                    Steps: {
                        colorPrimary: "#a3a3a3",
                        colorText: "#374151",
                        colorTextDescription: "#6b7280",
                        colorTextLabel: "#374151",
                        colorSplit: "#e5e7eb",
                        iconSize: 16,
                        dotSize: 16,
                    },
                },
            }}
        >
            <div className="flex flex-col bg-gray-100 rounded-xl p-4 sm:p-6 w-full overflow-x-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold">Hoạt động</h1>
                    <Select
                        className="w-full sm:w-56"
                        placeholder="Tất cả hoạt động"
                        options={[
                            { value: "all", label: "Tất cả hoạt động" },
                            { value: "shipping", label: "Đang vận chuyển" },
                            { value: "delivered", label: "Đã giao hàng" },
                        ]}
                    />
                </div>
                <Steps
                    progressDot
                    direction="vertical"
                    current={3}
                    items={[
                        {
                            title: "Đã tạo đơn hàng",
                            description: "27/05/2025 10:00",
                        },
                        {
                            title: "Đang vận chuyển",
                            description: "28/05/2025 08:00",
                        },
                        {
                            title: "Đã giao hàng",
                            description: "28/05/2025 15:30",
                        },
                    ]}
                    style={{
                        background: "#f3f4f6",
                        padding: "16px",
                        borderRadius: "12px",
                    }}
                />
            </div>
        </ConfigProvider>
    );
}