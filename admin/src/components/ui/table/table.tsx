import { Table as AntdTable } from "antd";
import { TableProps } from "antd/es/table";
import type { ColumnsType } from "antd/es/table";
import "./table.css";
import TablePagination from "./table-pagination";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";

const Table = <T extends object>(props: TableProps<T>) => {
  const centeredColumns = props.columns?.map((col: ColumnsType<T>[number]) => ({
    ...col,
    align: "center",
  })) as ColumnsType<T>;

  const current =
    typeof props.pagination !== "boolean" && props.pagination?.current
      ? props.pagination.current
      : DEFAULT_PAGINATION_QUERY.page;
  const pageSize =
    typeof props.pagination !== "boolean" && props.pagination?.pageSize
      ? props.pagination.pageSize
      : DEFAULT_PAGINATION_QUERY.perPage;
  const total =
    typeof props.pagination !== "boolean" && props.pagination?.total
      ? props.pagination.total
      : (props.dataSource?.length ?? 0);

  return (
    <div className="h-full overflow-x-auto flex flex-col gap-3">
      <AntdTable<T>
        {...props}
        columns={centeredColumns}
        pagination={false}
        className={`custom-table ${props.className ?? ""}`}
        scroll={{ x: "max-content" }}
        rowKey={props.rowKey}
      />
      <TablePagination
        currentPage={current}
        pageSize={pageSize}
        total={total}
        onPageChange={(page) => {
          if (
            typeof props.pagination !== "boolean" &&
            props.pagination?.onChange
          ) {
            props.pagination.onChange(page, pageSize);
          }
        }}
        onPageSizeChange={(size) => {
          if (
            typeof props.pagination !== "boolean" &&
            props.pagination?.onChange
          ) {
            props.pagination.onChange(1, size);
          }
        }}
      />
    </div>
  );
};

export default Table;
