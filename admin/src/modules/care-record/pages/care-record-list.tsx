import { useEffect, useCallback } from "react";
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

export default function CareRecordList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const { columns, confirmModalProps } = useCareRecordTableColumns({
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
        </div>
      </TableToolbar>

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

      <ConfirmModal {...confirmModalProps} />
    </div>
  );
}
