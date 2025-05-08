import { Table, Button } from "antd";
import { TableProps } from "antd/es/table";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import "./styles.css";
import TablePagination from "./TablePagination";
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
  const [mobileView, setMobileView] = useState<"card" | "table">("card");

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
    <div className="rounded-[5px] overflow-hidden h-full">
      {/* Table cho sm trở lên */}
      <div className="hidden sm:block">
        <Table<T>
          {...props}
          columns={centeredColumns}
          pagination={false}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
      {/* Card/Table cho mobile */}
      <div className="block sm:hidden">
        <div className="flex justify-start p-2">
          <Button
            icon={
              mobileView === "card" ? <TableOutlined /> : <AppstoreOutlined />
            }
            size="small"
            onClick={() =>
              setMobileView(mobileView === "card" ? "table" : "card")
            }
          >
            {mobileView === "card" ? "Bảng" : "Thẻ"}
          </Button>
        </div>
        {mobileView === "table" ? (
          <>
            <Table<T>
              {...props}
              columns={centeredColumns}
              pagination={false}
              className="custom-table"
              scroll={{ x: "max-content" }}
            />
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        ) : (
          <>
            <div className="space-y-4 p-2">
              {props.dataSource && props.dataSource.length > 0 ? (
                (props.dataSource as Record<string, unknown>[])
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((row, idx) => (
                    <div
                      key={row.id?.toString() || idx}
                      className="bg-white rounded shadow border border-gray-100 p-4 flex flex-col gap-2"
                    >
                      {Array.isArray(centeredColumns)
                        ? centeredColumns
                            .filter((col) => {
                              return (
                                col &&
                                typeof (col as { dataIndex?: unknown })
                                  .dataIndex === "string" &&
                                (col as { dataIndex?: string }).dataIndex !==
                                  "action"
                              );
                            })
                            .map((col, i) => {
                              const dataIndex = (col as { dataIndex: string })
                                .dataIndex;
                              let value = row[dataIndex];
                              if (
                                "render" in col &&
                                typeof col.render === "function"
                              ) {
                                const rendered = col.render(
                                  value,
                                  row as T,
                                  idx
                                );
                                if (React.isValidElement(rendered))
                                  return (
                                    <div key={i} className="flex text-sm">
                                      <span className="font-semibold min-w-[110px] text-gray-500">
                                        {typeof col.title === "function"
                                          ? col.title({})
                                          : col.title}
                                        :
                                      </span>
                                      <span className="ml-2 break-all">
                                        {rendered}
                                      </span>
                                    </div>
                                  );
                                if (
                                  rendered &&
                                  typeof rendered === "object" &&
                                  "children" in rendered
                                ) {
                                  value = (
                                    rendered as { children: React.ReactNode }
                                  ).children;
                                } else {
                                  value = rendered;
                                }
                              }
                              return (
                                <>
                                  <div key={i} className="flex text-sm ">
                                    <span className="font-semibold min-w-[110px] text-gray-500 ">
                                      {typeof col.title === "function"
                                        ? col.title({})
                                        : col.title}
                                      :
                                    </span>
                                    <span className="ml-2 break-all">
                                      {value as React.ReactNode}
                                    </span>
                                  </div>

                                  <span className="h-[1px] bg-gray-200" />
                                </>
                              );
                            })
                        : null}
                      {(() => {
                        const actionCol = (
                          centeredColumns as ColumnsType<
                            Record<string, unknown>
                          >
                        ).find((col) => col.key === "action");
                        if (!actionCol || !actionCol.render) return null;
                        const rendered = actionCol.render(null, row, idx);
                        if (React.isValidElement(rendered)) {
                          return (
                            <div className="flex justify-end pt-2">
                              {rendered}
                            </div>
                          );
                        }
                        if (
                          rendered &&
                          typeof rendered === "object" &&
                          "children" in rendered
                        ) {
                          return (
                            <div className="flex justify-end pt-2">
                              {
                                (rendered as { children: React.ReactNode })
                                  .children
                              }
                            </div>
                          );
                        }
                        return (
                          <div className="flex justify-end pt-2">
                            {rendered as React.ReactNode}
                          </div>
                        );
                      })()}
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {"Không có dữ liệu"}
                </div>
              )}
            </div>
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TableReuse;
