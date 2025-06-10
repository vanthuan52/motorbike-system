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

  const handlePageChange = (page: number) => {
    if (typeof props.pagination !== "boolean" && props.pagination?.onChange) {
      props.pagination.onChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (value: number) => {
    if (typeof props.pagination !== "boolean" && props.pagination?.onChange) {
      props.pagination.onChange(1, value);
    }
  };

  return (
    <div className="h-full overflow-x-auto">
      <AntdTable<T>
        {...props}
        dataSource={props.dataSource}
        columns={centeredColumns}
        pagination={false}
        className="custom-table"
        scroll={{ x: "max-content" }}
        rowKey={props.rowKey}
      />
      <TablePagination
        currentPage={current}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Table;
