import { useEffect, useState } from "react";
import { Table as AntdTable } from "antd";
import { TableProps } from "antd/es/table";
import type { ColumnsType } from "antd/es/table";
import "./table.css";
import TablePagination from "./table-pagination";

const Table = <T extends object>(props: TableProps<T>) => {
  const centeredColumns = props.columns?.map((col: ColumnsType<T>[number]) => ({
    ...col,
    align: "center",
  })) as ColumnsType<T>;

  const defaultPageSize =
    typeof props.pagination !== "boolean" && props.pagination?.pageSize
      ? props.pagination.pageSize
      : 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const total =
    typeof props.pagination !== "boolean" && props.pagination?.total
      ? props.pagination.total
      : (props.dataSource?.length ?? 0);

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof props.pagination !== "boolean" && props.pagination?.onChange) {
      props.pagination.onChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
    if (typeof props.pagination !== "boolean" && props.pagination?.onChange) {
      props.pagination.onChange(1, value);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [props.dataSource]);
  const paginatedData =
    props.dataSource?.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    ) ?? [];
  return (
    <div className="h-full overflow-x-auto">
      <AntdTable<T>
        {...props}
        dataSource={paginatedData}
        columns={centeredColumns}
        pagination={false}
        className="custom-table"
        scroll={{ x: "max-content" }}
        rowKey={props.rowKey}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Table;
