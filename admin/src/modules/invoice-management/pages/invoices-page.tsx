/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import { mockInvoices } from "../mocks/Invoices";
import InvoiceTable from "../components/invoices-page/InvoiceTable";
import InvoiceDetailPanel from "../components/invoices-page/InvoiceDetailPanel";
import InvoiceHeader from "../components/invoices-page/InvoiceHeader";
import InvoiceCreateModal from "../components/invoices-page/InvoiceCreateModal";
import SkeletonTable from "@/components/ui/SkeletonTable";

export default function InvoicesPage() {
  const [selectedRow, setSelectedRow] = useState<
    (typeof mockInvoices)[0] | null
  >(null);
  const [payload, setPayload] = useState({
    search: "",
    payment: "",
    payment_method: "",
    shipping_method: "",
    page: 1,
    perPage: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState(mockInvoices);
  const [loading, setLoading] = useState(true);
  const pagination = {
    pageSize: payload.perPage,
    current: payload.page,
    total: dataSource.length,
    onChange: (page: number, pageSize?: number) => {
      setPayload((prev) => ({
        ...prev,
        page,
        perPage: pageSize || prev.perPage,
      }));
    },
  };
  const handleResetFilter = () => {
    setPayload({
      search: "",
      payment: "",
      payment_method: "",
      shipping_method: "",
      page: 1,
      perPage: 10,
    });
  };

  useEffect(() => {
    setLoading(true);
    setDataSource(mockInvoices);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleSelectRow = (
    row: (typeof mockInvoices)[0] | null,
    keys: React.Key[]
  ) => {
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

  const filteredData = dataSource.filter((inv) => {
    const matchSearch =
      !payload.search ||
      inv.id.toLowerCase().includes(payload.search.toLowerCase()) ||
      inv.customer_id.toLowerCase().includes(payload.search.toLowerCase()) ||
      inv.products.some((p) =>
        p.name.toLowerCase().includes(payload.search.toLowerCase())
      );
    const matchPayment =
      !payload.payment || inv.payment_status === payload.payment;
    const matchPaymentMethod =
      !payload.payment_method || inv.payment_method === payload.payment_method;
    const matchShippingMethod =
      !payload.shipping_method ||
      inv.shipping_method === payload.shipping_method;
    return (
      matchSearch && matchPayment && matchPaymentMethod && matchShippingMethod
    );
  });
  const pagedData = filteredData.slice(
    (payload.page - 1) * payload.perPage,
    payload.page * payload.perPage
  );
  const onCreateInvoice = async (values: any) => {
    console.log(values);
  };
  const handleExportExcel = () => {};

  return (
    <div className="flex flex-col lg:flex-row gap-2 mx-4  my-10 sm:my-2 px-3 py-2 transition-all duration-300 rounded-xl bg-white border border-gray-200 shadow-sm">
      <div
        className={`
          bg-white 
          flex-1 w-full
        `}
      >
        <InvoiceHeader
          search={payload.search ?? ""}
          setSearch={(v) =>
            handleFilterChange(() =>
              setPayload((prev) => ({ ...prev, search: v }))
            )
          }
          payment={payload.payment ?? ""}
          setPayment={(v) =>
            handleFilterChange(() =>
              setPayload((prev) => ({ ...prev, payment: v }))
            )
          }
          paymentMethod={payload.payment_method ?? ""}
          setPaymentMethod={(v) =>
            handleFilterChange(() =>
              setPayload((prev) => ({ ...prev, payment_method: v }))
            )
          }
          shippingMethod={payload.shipping_method ?? ""}
          setShippingMethod={(v) =>
            handleFilterChange(() =>
              setPayload((prev) => ({ ...prev, shipping_method: v }))
            )
          }
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
              pagination={pagination}
            />
          </>
        )}
      </div>
      <Drawer
        open={panelVisible}
        onClose={handleClosePanel}
        placement="right"
        width={800}
        closeIcon={false}
        className="!p-0"
        destroyOnHidden
      >
        <InvoiceDetailPanel
          selectedRow={selectedRow || undefined}
          panelVisible={panelVisible}
          onClose={handleClosePanel}
          loading={loadingDetail}
        />
      </Drawer>
      <InvoiceCreateModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={onCreateInvoice}
      />
    </div>
  );
}
