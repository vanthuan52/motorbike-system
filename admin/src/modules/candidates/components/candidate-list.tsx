import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import { useFilters } from "@/hooks/use-filters";
import usePagination from "@/hooks/use-pagination";
import { useQueryParams } from "@/hooks/use-query-params";
import { useDebounce } from "@/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCandidateTableColumns } from "../hooks/useCandidateTableColumn";
import { RootState } from "@/store";
import { useCallback, useEffect } from "react";
import { candidateActions } from "../store/candidate-slice";
import { CandidatePaginationQuery, ENUM_CANDIDATE_STATUS } from "../types";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import Table from "@/components/ui/table/table";

export default function CandidateList() {
  const { id } = useParams<{ id: string }>();
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
  const {
    candidates,
    loadingList,
    pagination: paginationState,
  } = useSelector((state: RootState) => state.candidates);
  const { filters, mappedFilters, handleFiltersChange } =
    useFilters(restParams);
  const debouncedSearchTerm = useDebounce(search ?? "", 500);
  useEffect(() => {
    dispatch(
      candidateActions.getCandidates({
        page: pagination.page,
        perPage: pagination.perPage,
        hiringId: id,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as CandidatePaginationQuery)
    );
  }, [dispatch, pagination, debouncedSearchTerm, mappedFilters]);
  const { columns } = useCandidateTableColumns({
    currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
    pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
    hiringId: candidates[0]?.hiringId,
  });
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
  const statusOptions: SelectOptionItem[] = [
    { value: "all", label: "Tất cả" },
    { value: ENUM_CANDIDATE_STATUS.NEW, label: "Mới" },
    { value: ENUM_CANDIDATE_STATUS.HIRED, label: "Đã tuyển" },
    {
      value: ENUM_CANDIDATE_STATUS.INTERVIEW_SCHEDULED,
      label: "Đã lên lịch hẹn",
    },
    { value: ENUM_CANDIDATE_STATUS.REJECTED, label: "Đã từ chối" },
    { value: ENUM_CANDIDATE_STATUS.REVIEWED, label: "Đã xem" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar
        onSearchChange={handleSearchChange}
        searchValue={search ?? ""}
        placeholderSearch="Tìm kiếm theo tên, email..."
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
        dataSource={candidates}
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
    </div>
  );
}
