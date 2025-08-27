import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import { RootState } from "@/store";
import { careRecordActions } from "../store/care-record-slice";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryParams } from "@/hooks/use-query-params";
import usePagination from "@/hooks/use-pagination";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import { useFilters } from "@/hooks/use-filters";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import { ConfirmModal } from "@/components/ui/modal/confirm-modal";
import {
  CareRecordPaginationQuery,
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from "../types";
import { useCareRecordTableColumns } from "../hooks/useCareRecordTableColumns";
import { Button } from "antd";
import CareRecordCard from "../components/care-record-card";
import { AiOutlineTable } from "react-icons/ai";
import { BiCard } from "react-icons/bi";

export default function CareRecordList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [queryParams, setQueryParams] = useQueryParams();
  const {
    page: pageParam,
    perPage: limitParam,
    search,
    ...restParams
  } = queryParams;

  const { pagination, handlePaginationChange } = usePagination({
    page: Number(pageParam) || DEFAULT_PAGINATION_QUERY.page,
    perPage: Number(limitParam) || DEFAULT_PAGINATION_QUERY.perPage,
  });

  const { filters, mappedFilters, handleFiltersChange } =
    useFilters(restParams);

  const debouncedSearchTerm = useDebounce(search ?? "", 500);

  const { columns, vehicleModelMap, confirmModalProps } =
    useCareRecordTableColumns({
      currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
      pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
      search: debouncedSearchTerm,
      mappedFilters: mappedFilters,
    });

  const {
    careRecords: CareRecords,
    loadingList,
    pagination: paginationState,
    deletion,
  } = useSelector((state: RootState) => state.careRecords);

  useEffect(() => {
    dispatch(
      careRecordActions.getCareRecords({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as CareRecordPaginationQuery)
    );
  }, [
    dispatch,
    pagination,
    debouncedSearchTerm,
    deletion.success,
    mappedFilters,
  ]);

  useEffect(() => {
    setQueryParams({
      page: pagination.page?.toString(),
      perPage: pagination.perPage?.toString(),
      search: search ?? "",
      ...mappedFilters,
    });
  }, [pagination, mappedFilters, search]);

  const handlePageChange = useCallback(
    (page: number, perPage: number) => {
      handlePaginationChange({ page, perPage });
    },
    [handlePaginationChange]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setQueryParams({
        ...mappedFilters,
        page: "1",
        search: value,
      });
    },
    [mappedFilters]
  );

  const handleStatusFilterChange = useCallback(
    (value: string | string[] | undefined) => {
      handleFiltersChange("status", value === "all" ? undefined : value);
      handlePaginationChange({
        page: DEFAULT_PAGINATION_QUERY.page,
        perPage: DEFAULT_PAGINATION_QUERY.perPage,
      });
    },
    []
  );

  const handlePaymentStatusFilterChange = useCallback(
    (value: string | string[] | undefined) => {
      handleFiltersChange("paymentStatus", value === "all" ? undefined : value);
      handlePaginationChange({
        page: DEFAULT_PAGINATION_QUERY.page,
        perPage: DEFAULT_PAGINATION_QUERY.perPage,
      });
    },
    []
  );

  const handleCreate = () => {
    navigate(`${ROUTER_PATH.CARE_RECORD_CREATION}`);
  };

  const statusOptions: SelectOptionItem[] = [
    { value: "all", label: "Tất cả" },
    { value: ENUM_CARE_RECORD_STATUS.PENDING, label: "Chờ xử lý" },
    { value: ENUM_CARE_RECORD_STATUS.IN_PROGRESS, label: "Đang xử lý" },
    { value: ENUM_CARE_RECORD_STATUS.DONE, label: "Hoàn tất" },
    { value: ENUM_CARE_RECORD_STATUS.CANCEL, label: "Đã hủy" },
  ];

  const statusPaymentOptions: SelectOptionItem[] = [
    { value: "all", label: "Tất cả" },
    {
      value: ENUM_PAYMENT_STATUS.PAID,
      label: "Đã thanh toán",
    },
    {
      value: ENUM_PAYMENT_STATUS.UNPAID,
      label: "Chưa thanh toán",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar
        onSearchChange={handleSearchChange}
        onAddNewClick={handleCreate}
      >
        <div className="flex items-center justify-between gap-3">
          <SelectOption
            placeholder="Trạng thái"
            value={filters.status || "all"}
            onChange={handleStatusFilterChange}
            options={statusOptions}
            className="!h-10 w-40 xs:w-50"
            allowClear
          />

          <SelectOption
            placeholder="Thanh toán"
            value={filters.paymentStatus || "all"}
            onChange={handlePaymentStatusFilterChange}
            options={statusPaymentOptions}
            className="!h-10 w-40 xs:w-50"
            allowClear
          />

          <div className="flex gap-2">
            {viewMode === "table" ? (
              <Button
                type="default"
                icon={<BiCard className="text-lg" />}
                onClick={() => setViewMode("card")}
                size="large"
              />
            ) : (
              <Button
                type="default"
                icon={<AiOutlineTable className="text-lg" />}
                onClick={() => setViewMode("table")}
                size="large"
              />
            )}
          </div>
        </div>
      </TableToolbar>

      <div className="px-4 pb-4">
        {viewMode === "table" ? (
          <Table
            dataSource={CareRecords}
            columns={columns}
            rowKey="_id"
            loading={loadingList}
            pagination={{
              current: pagination.page,
              pageSize: pagination.perPage,
              total: paginationState?.total ?? 0,
              onChange: handlePageChange,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
            {CareRecords.map((record) => (
              <CareRecordCard
                vehicleModelMap={vehicleModelMap}
                record={record}
                onView={() =>
                  navigate(
                    `${ROUTER_PATH.CARE_RECORD_DETAIL.replace(":id", record._id)}`
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal {...confirmModalProps} />
    </div>
  );
}
