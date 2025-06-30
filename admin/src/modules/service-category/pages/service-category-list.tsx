import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import { RootState } from "@/store";
import { serviceCategoryActions } from "../store/service-category-slice";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "../../../hooks/useDebounce";
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
  ServiceCategoryPaginationQuery,
  ENUM_SERVICE_CATEGORY_STATUS,
} from "../types";
import { useServiceCategoryTableColumns } from "../hooks/useServiceCategoryTableColumns";

export default function ServiceCategoryList() {
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

  const { columns, confirmModalProps } = useServiceCategoryTableColumns({
    currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
    pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
    search: debouncedSearchTerm,
    mappedFilters: mappedFilters,
  });

  const {
    list: serviceCategories,
    loadingList,
    pagination: paginationState,
    deletion,
  } = useSelector((state: RootState) => state.serviceCategory);

  useEffect(() => {
    dispatch(
      serviceCategoryActions.getServiceCategories({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as ServiceCategoryPaginationQuery)
    );
  }, [
    dispatch,
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
    navigate(`${ROUTER_PATH.SERVICE_CATEGORY_CREATION}`);
  };
  const statusOptions: SelectOptionItem[] = [
    { value: "all", label: "Tất cả" },
    { value: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE, label: "Hoạt động" },
    { value: ENUM_SERVICE_CATEGORY_STATUS.INACTIVE, label: "Không hoạt động" },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar
        onSearchChange={handleSearchChange}
        onAddNewClick={handleCreate}
        searchValue={search ?? ""}
        placeholderSearch="Tìm kiếm theo tên"
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
        </div>
      </TableToolbar>

      <Table
        dataSource={serviceCategories}
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
