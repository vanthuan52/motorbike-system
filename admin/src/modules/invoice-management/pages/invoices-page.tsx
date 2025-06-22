/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { Button, Drawer } from "antd";
import { mockInvoices } from "../mocks/Invoices";
import InvoiceTable from "../components/invoices-page/InvoiceTable";
import InvoiceDetailPanel from "../components/invoices-page/InvoiceDetailPanel";
import InvoiceHeader from "../components/invoices-page/InvoiceHeader";
import InvoiceCreateModal from "../components/invoices-page/InvoiceCreateModal";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { CgExport } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";

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
    perPage: 5,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState(mockInvoices);
  const [loading, setLoading] = useState(true);

  const filteredData = useMemo(() => {
    return dataSource.filter((inv) => {
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
        !payload.payment_method ||
        inv.payment_method === payload.payment_method;
      const matchShippingMethod =
        !payload.shipping_method ||
        inv.shipping_method === payload.shipping_method;

      return (
        matchSearch && matchPayment && matchPaymentMethod && matchShippingMethod
      );
    });
  }, [dataSource, payload]);

  const pagination = {
    pageSize: payload.perPage,
    current: payload.page,
    total: filteredData.length,
    onChange: (page: number, pageSize?: number) => {
      setPayload((prev) => ({
        ...prev,
        page,
        perPage: pageSize || 5,
      }));
    },
  };

  const pagedData = useMemo(() => {
    return filteredData.slice(
      (payload.page - 1) * payload.perPage,
      payload.page * payload.perPage
    );
  }, [filteredData, payload]);

  const handleResetFilter = () => {
    setPayload({
      search: "",
      payment: "",
      payment_method: "",
      shipping_method: "",
      page: 1,
      perPage: 5,
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

  const onCreateInvoice = async (values: any) => {
    console.log(values);
  };

  const handleExportExcel = () => {};

  return (
    <div className="sm:px-4 pt-8 sm:pt-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:gap-0 px-2 sm:px-0 py-2">
        <h1 className="text-xl sm:text-[26px] font-semibold text-center sm:text-left w-full sm:w-auto">
          Hoá đơn
        </h1>
        <div className="flex flex-row flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <Button
            color="default"
            variant="outlined"
            icon={<CgExport />}
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
          <Button
            color="default"
            variant="solid"
            icon={<FaPlus />}
            onClick={onCreateInvoice}
          >
            Tạo hóa đơn
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="mb-4 px-5 pt-4 ">
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
        </div>

        {loading ? (
          <SkeletonTable
            columns={[
              { title: "", width: 50, height: 50 },
              { title: "MÃ HÓA ĐƠN", width: 100, height: 20 },
              { title: "SẢN PHẨM" },
              { title: "LOẠI PHỤ TÙNG" },
              { title: "THANH TOÁN" },
              { title: "ĐỊA CHỈ" },
              { title: "NGÀY GIAO HÀNG" },
              { title: "TỔNG TIỀN" },
            ]}
            rows={5}
          />
        ) : (
          <InvoiceTable
            data={filteredData}
            onSelectRow={(row, keys) => handleSelectRow(row, keys)}
            selectedRow={selectedRow || undefined}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            loading={loadingTable}
            pagination={pagination}
          />
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
