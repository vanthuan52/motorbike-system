import { Table } from "antd";
import { TableProps } from "antd/es/table";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import "./styles.css";
import TablePagination from "./TablePagination";

/**
 * A reusable table component with a default pagination and centered columns.
 *
 * @param {TableProps<T>} props The props for the table component.
 * @param {ColumnsType<T>} [props.columns] The columns configuration for the table.
 * @param {PaginationConfig} [props.pagination] The pagination configuration for the table.
 * @param {number} [props.pagination.pageSize] The default page size for the table.
 * @param {(page: number, pageSize: number) => void} [props.pagination.onChange] The callback function when the page or page size is changed.
 * @param {T[]} [props.dataSource] The data source for the table.
 *
 * @returns {ReactElement} The table component with a default pagination and centered columns.
 */
const TableReuse = <T extends object>(props: TableProps<T>) => {
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
      : props.dataSource?.length ?? 0;

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

  return (
    <div className="rounded-[5px] overflow-hidden border border-gray-200">
      <Table<T>
        {...props}
        columns={centeredColumns}
        pagination={false}
        className="custom-table"
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

export default TableReuse;
