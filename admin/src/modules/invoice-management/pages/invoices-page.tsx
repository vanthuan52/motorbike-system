/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import { mockInvoices } from "../mocks/Invoices";
import InvoiceTable from "../components/invoices-page/InvoiceTable";
import InvoiceDetailPanel from "../components/invoices-page/InvoiceDetailPanel";
import InvoiceHeader from "../components/invoices-page/InvoiceHeader";
import CustomPagination from "../components/invoices-page/CustomPagination";
import InvoiceCreateModal from "../components/invoices-page/InvoiceCreateModal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function InvoicesPage() {
    const [selectedRow, setSelectedRow] = useState<typeof mockInvoices[0] | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [panelVisible, setPanelVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [payment, setPayment] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [shippingMethod, setShippingMethod] = useState<string>('');
    const [loadingTable, setLoadingTable] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dataSource, setDataSource] = useState(mockInvoices);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(true);
        setDataSource(mockInvoices);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    const handleSelectRow = (row: typeof mockInvoices[0] | null, keys: React.Key[]) => {
        setLoadingDetail(true);
        setSelectedRow(row);
        setSelectedRowKeys(keys);
        setPanelVisible(!!row);
        setTimeout(() => setLoadingDetail(false), 350);
    };

    const handleClosePanel = () => {
        setPanelVisible(false);
        setTimeout(() => {
            setSelectedRow(null);
            setSelectedRowKeys([]);
        }, 200);
    };

    const handleFilterChange = (fn: () => void) => {
        setLoadingTable(true);
        fn();
        setTimeout(() => setLoadingTable(false), 400);
    };

    const filteredData = dataSource.filter(inv => {
        const matchSearch =
            !search ||
            inv.id.toLowerCase().includes(search.toLowerCase()) ||
            inv.customer_id.toLowerCase().includes(search.toLowerCase()) ||
            inv.products.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
        const matchPayment = !payment || inv.payment_status === payment;
        const matchPaymentMethod = !paymentMethod || inv.payment_method === paymentMethod;
        const matchShippingMethod = !shippingMethod || inv.shipping_method === shippingMethod;
        return (matchSearch &&
            matchPayment &&
            matchPaymentMethod &&
            matchShippingMethod
        );
    });
    const pagedData = filteredData.slice((current - 1) * pageSize, current * pageSize);
    const onCreateInvoice = async (values: any) => {
        console.log(values);
    }
    const handleExportExcel = () => { };
    return (
        <div className="flex flex-col lg:flex-row gap-2 mx-4  my-10 sm:my-2 px-3 py-2 transition-all duration-300 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div
                className={`
                    bg-white p-4 rounded-xl shadow-sm transition-all duration-300
                    ${selectedRow && !isMobile ? "flex-[2_2_0%] w-3/4" : "flex-1 w-full"}
                `}
            >
                <InvoiceHeader
                    search={search}
                    setSearch={v => handleFilterChange(() => setSearch(v))}
                    payment={payment ?? ""}
                    setPayment={v => handleFilterChange(() => setPayment(v))}
                    paymentMethod={paymentMethod ?? ""}
                    setPaymentMethod={v => handleFilterChange(() => setPaymentMethod(v))}
                    shippingMethod={shippingMethod ?? ""}
                    setShippingMethod={v => handleFilterChange(() => setShippingMethod(v))}
                    onCreateInvoice={() => setCreateModalOpen(true)}
                    handleExportExcel={handleExportExcel}
                />
                {loading ? (
                    <SkeletonTable
                        columns={[
                            { title: "", width: 50, height: 50 },
                            { title: "Mã hoá đơn", width: 100, height: 20 },
                            { title: "Sản phẩm" },
                            { title: "Loại phụ tùng" },
                            { title: "Thanh toán" },
                            { title: "Địa chỉ" },
                            { title: "Ngày giao hàng" },
                            { title: "Tổng tiền" },
                        ]}
                        rows={5}
                    />
                ) : (
                    <>
                        <InvoiceTable
                            data={pagedData}
                            onSelectRow={(row, keys) => handleSelectRow(row, keys)}
                            selectedRow={selectedRow || undefined}
                            selectedRowKeys={selectedRowKeys}
                            setSelectedRowKeys={setSelectedRowKeys}
                            loading={loadingTable}
                        />
                        <CustomPagination
                            current={current}
                            pageSize={pageSize}
                            total={filteredData.length}
                            onChange={(page, size) => {
                                setCurrent(page);
                                setPageSize(size);
                            }}
                            pageSizeOptions={[10, 20, 50, 100]}
                        />
                    </>
                )}
            </div>
            {isMobile ? (
                <Drawer
                    open={panelVisible}
                    onClose={handleClosePanel}
                    placement="right"
                    width="100vw"
                    closeIcon={false}
                    className="!p-0"
                >
                    <InvoiceDetailPanel
                        selectedRow={selectedRow || undefined}
                        panelVisible={panelVisible}
                        onClose={handleClosePanel}
                        loading={loadingDetail}
                    />
                </Drawer>
            ) : (
                <div
                    className={`
                        relative transition-all duration-300 
                        ${selectedRow ? "w-[340px] ml-0" : "w-0 ml-0 overflow-hidden"}
                    `}
                    style={{ minWidth: selectedRow ? 340 : 0, maxWidth: selectedRow ? 400 : 0 }}
                >
                    <InvoiceDetailPanel
                        selectedRow={selectedRow || undefined}
                        panelVisible={panelVisible}
                        onClose={handleClosePanel}
                        loading={loadingDetail}
                    />
                </div>
            )}
            <InvoiceCreateModal
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                onSuccess={onCreateInvoice}
            />
        </div>
    );
}