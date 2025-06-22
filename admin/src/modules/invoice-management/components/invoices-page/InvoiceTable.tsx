import { invoiceColumns } from "./Columns";
import { InvoiceManagement } from "../../types";
import Table from "@/components/ui/table/table";

export default function InvoiceTable({
  data,
  onSelectRow,
  selectedRow,
  selectedRowKeys,
  setSelectedRowKeys,
  loading,
  pagination,
}: {
  data: InvoiceManagement[];
  onSelectRow: (row: InvoiceManagement | null, keys: React.Key[]) => void;
  selectedRow: InvoiceManagement | undefined;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (keys: React.Key[]) => void;
  loading: boolean;
  pagination?: {
    pageSize: number;
    current: number;
    total: number;
    onChange: (page: number, pageSize?: number) => void;
  };
}) {
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (
  //     newSelectedRowKeys: React.Key[],
  //     selectedRows: InvoiceManagement[]
  //   ) => {
  //     const keys = newSelectedRowKeys.slice(-1);
  //     setSelectedRowKeys(keys);
  //     if (selectedRows.length > 0) {
  //       onSelectRow(selectedRows[selectedRows.length - 1], keys);
  //     } else {
  //       onSelectRow(null, []);
  //     }
  //   },
  //   getCheckboxProps: (record: InvoiceManagement) => ({
  //     disabled:
  //       selectedRowKeys.length >= 1 && !selectedRowKeys.includes(record.id),
  //   }),
  // };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Table
        columns={invoiceColumns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        // rowSelection={rowSelection}
        onRow={(rec) => ({
          onClick: () => {
            if (selectedRowKeys.includes(rec.id)) {
              setSelectedRowKeys([]);
              onSelectRow(null, []);
            } else {
              setSelectedRowKeys([rec.id]);
              onSelectRow(rec, [rec.id]);
            }
          },
          style: {
            cursor: "pointer",
            background: selectedRow?.id === rec.id ? "#f0f5ff" : undefined,
          },
        })}
        loading={loading}
        rootClassName="overflow-auto"
      />
    </div>
  );
}
