import { Table as AntdTable } from "antd";
import { TableProps } from "antd/es/table";
import type { ColumnsType } from "antd/es/table";
import "./table.css";
import TablePagination from "./table-pagination";
import { useMemo, useState } from "react";

const Table = <T extends object>(props: TableProps<T>) => {
  const centeredColumns = props.columns?.map((col: ColumnsType<T>[number]) => ({
    ...col,
    align: "center",
  })) as ColumnsType<T>;

  const current =
    typeof props.pagination !== "boolean" && props.pagination?.current
      ? props.pagination.current
      : 1;
  const pageSize =
    typeof props.pagination !== "boolean" && props.pagination?.pageSize
      ? props.pagination.pageSize
      : 5;
  const total =
    typeof props.pagination !== "boolean" && props.pagination?.total
      ? props.pagination.total
      : (props.dataSource?.length ?? 0);

  const [currentPage, setCurrentPage] = useState(current);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof props.pagination !== "boolean" && props.pagination?.onChange) {
      props.pagination.onChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setCurrentPage(1);
    setCurrentPageSize(value);
    if (typeof props.pagination !== "boolean" && props.pagination?.onChange) {
      props.pagination.onChange(1, value);
    }
  };

  const paginatedData = useMemo(() => {
    if (typeof props.pagination === "boolean") return props.dataSource ?? [];
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;
    return props.dataSource?.slice(start, end) ?? [];
  }, [props.dataSource, currentPage, currentPageSize]);

  return (
    <div className="h-full overflow-x-auto flex flex-col gap-3">
      <AntdTable<T>
        {...props}
        dataSource={paginatedData}
        columns={centeredColumns}
        pagination={false}
        className={`custom-table ${props.className ?? ""}`}
        scroll={{ x: "max-content" }}
        rowKey={props.rowKey}
      />
      <TablePagination
        currentPage={currentPage}
        pageSize={currentPageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Table;
