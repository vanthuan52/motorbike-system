import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import { RootState } from "@/store";
import { storeActions } from "../store/stores-slice";
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
import { StorePaginationQuery, ENUM_STORE_STATUS } from "../types";
import { useStoreTableColumns } from "../hooks/useStoreTableColumns";

export default function StoreList() {
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

  const { columns, confirmModalProps } = useStoreTableColumns({
    currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
    pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
    search: debouncedSearchTerm,
    mappedFilters: mappedFilters,
  });

  const {
    stores,
    loadingList,
    pagination: paginationState,
    deletion,
  } = useSelector((state: RootState) => state.stores);

  useEffect(() => {
    dispatch(
      storeActions.getStore({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as StorePaginationQuery)
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

  const handleStatusFilterChange = useCallback((value: string | string[]) => {
    handleFiltersChange("status", value === "all" ? undefined : value);
    handlePaginationChange({
      page: DEFAULT_PAGINATION_QUERY.page,
      perPage: DEFAULT_PAGINATION_QUERY.perPage,
    });
  }, []);

  const handleCreate = () => {
    navigate(`${ROUTER_PATH.STORE_CREATION}`);
  };

  const statusOptions: SelectOptionItem[] = [
    { value: "all", label: "Tất cả" },
    { value: ENUM_STORE_STATUS.ACTIVE, label: "Hoạt động" },
    { value: ENUM_STORE_STATUS.INACTIVE, label: "Không hoạt động" },
  ];

  return (
    <div className='bg-white rounded-lg shadow-md'>
      <TableToolbar
        onSearchChange={handleSearchChange}
        onAddNewClick={handleCreate}
        searchValue={search ?? ""}
        placeholderSearch='Tìm kiếm theo tên cửa hàng'
      >
        <div className='flex items-center justify-between gap-3'>
          <SelectOption
            placeholder='Trạng thái'
            value={filters.status || "all"}
            onChange={handleStatusFilterChange}
            options={statusOptions}
            className='!h-10 w-40 xs:w-50'
            allowClear
          />
        </div>
      </TableToolbar>

      <Table
        dataSource={stores}
        columns={columns}
        rowKey='_id'
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
