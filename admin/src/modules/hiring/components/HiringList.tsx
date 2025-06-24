import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Hiring, HiringPaginationQuery } from "../types";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "@/hooks/useDebounce";
import { RootState } from "@/store";
import { hiringActions } from "../store/hiring-slice";
import Table from "@/components/ui/table/table";
import { getHiringColumns } from "../components/hiring-columns";
import { useQueryParams } from "@/hooks/use-query-params";
import usePagination from "@/hooks/use-pagination";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import { useFilters } from "@/hooks/use-filters";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption from "@/components/ui/ant-design/select-option";
import { JOB_TYPE_OPTIONS, STATUS_HIRING_OPTIONS } from "../constants/status";

export default function HiringList() {
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

  const {
    hiringList,
    loading,
    pagination: paginationState,
  } = useSelector((state: RootState) => state.hiring);

  useEffect(() => {
    dispatch(
      hiringActions.getHiring({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as HiringPaginationQuery)
    );
  }, [dispatch, pagination, debouncedSearchTerm, mappedFilters]);

  useEffect(() => {
    setQueryParams({
      page: pagination.page?.toString(),
      perPage: pagination.perPage?.toString(),
      search: search ?? "",
      ...mappedFilters,
    });
  }, [pagination, mappedFilters, search]);

  const openCreate = useCallback(
    () => navigate(ROUTER_PATH.CREATE_HIRING),
    [navigate]
  );

  const openEdit = useCallback(
    (record: Hiring) => navigate(`${ROUTER_PATH.HIRING}/${record._id}`),
    [navigate]
  );

  const handleDeleteHiring = useCallback(
    (id: string) => dispatch(hiringActions.deleteHiring({ hiringId: id })),
    [dispatch]
  );

  const handleStatusFilterChange = useCallback((value: string | string[]) => {
    handleFiltersChange("status", value === "all" ? undefined : value);
    handlePaginationChange({
      page: DEFAULT_PAGINATION_QUERY.page,
      perPage: DEFAULT_PAGINATION_QUERY.perPage,
    });
  }, []);

  const handleJobTypeFilterChange = useCallback((value: string | string[]) => {
    handleFiltersChange("jobType", value === "all" ? undefined : value);
    handlePaginationChange({
      page: DEFAULT_PAGINATION_QUERY.page,
      perPage: DEFAULT_PAGINATION_QUERY.perPage,
    });
  }, []);
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

  const columns = useMemo(
    () =>
      getHiringColumns({
        onView: (id) =>
          navigate(`${ROUTER_PATH.HIRING_DETAILS.replace(":id", id)}`),
        openEdit,
        handleDeleteHiring,
      }),
    [openEdit, handleDeleteHiring]
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar
        onSearchChange={handleSearchChange}
        onAddNewClick={openCreate}
        searchValue={search ?? ""}
        placeholderSearch="Tìm kiếm theo tiêu đề"
      >
        <div className="flex items-center justify-between gap-3">
          <SelectOption
            placeholder="Trạng thái"
            value={filters.status || "all"}
            onChange={handleStatusFilterChange}
            options={STATUS_HIRING_OPTIONS}
            className="w-[130px] xs:w-[160px]"
            allowClear
          />
          <SelectOption
            placeholder="Loại việc làm"
            value={filters.jobType || "all"}
            onChange={handleJobTypeFilterChange}
            options={JOB_TYPE_OPTIONS}
            className="w-[130px] xs:w-[160px]"
            allowClear
          />
        </div>
      </TableToolbar>
      <Table
        dataSource={hiringList}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.perPage,
          total: paginationState?.total ?? 0,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}
