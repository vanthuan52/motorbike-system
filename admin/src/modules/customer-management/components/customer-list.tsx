import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import { RootState } from "@/store";
import { customerActions } from "../store/customer-slice";
import { ENUM_USER_GENDER, ENUM_USER_STATUS, User } from "@/modules/user/types";
import { getCustomerColumns } from "../components/customer-column";
import { UserPaginationQuery } from "@/modules/user/types";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "@/hooks/useDebounce";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption, {
  SelectOptionItem,
} from "@/components/ui/ant-design/select-option";
import { useQueryParams } from "@/hooks/use-query-params";
import usePagination from "@/hooks/use-pagination";
import { useFilters } from "@/hooks/use-filters";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";

const CustomerList = () => {
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
    users: customers,
    loading,
    pagination: paginationState,
  } = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    dispatch(
      customerActions.getCustomers({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as UserPaginationQuery)
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

  const handleGenderFilterChange = useCallback(
    (value: string | string[]) => {
      handleFiltersChange("gender", value === "all" ? undefined : value);
      handlePaginationChange({
        page: 1,
        perPage: DEFAULT_PAGINATION_QUERY.perPage,
      });
    },
    [handleFiltersChange]
  );

  const handleStatusFilterChange = useCallback((value: string | string[]) => {
    handleFiltersChange("status", value === "all" ? undefined : value);
    handlePaginationChange({
      page: DEFAULT_PAGINATION_QUERY.page,
      perPage: DEFAULT_PAGINATION_QUERY.perPage,
    });
  }, []);

  const handleDeleteCustomer = useCallback(
    (id: string) => {
      dispatch(customerActions.deleteCustomer({ customerId: id }));
    },
    [dispatch]
  );

  const handleEditCustomer = useCallback(
    (user: User) => {
      navigate(
        `${ROUTER_PATH.CUSTOMERS_DETAIL.replace(":id", user._id)}?edit=1`
      );
    },
    [navigate]
  );

  const genderOptions: SelectOptionItem[] = [
    { value: "all", label: "Tất cả" },
    { value: ENUM_USER_GENDER.MALE, label: "Nam" },
    { value: ENUM_USER_GENDER.FEMALE, label: "Nữ" },
    { value: ENUM_USER_GENDER.OTHER, label: "Khác" },
  ];

  const statusOptions: SelectOptionItem[] = [
    { value: "all", label: "Tất cả" },
    { value: ENUM_USER_STATUS.ACTIVE, label: "Hoạt động" },
    { value: ENUM_USER_STATUS.INACTIVE, label: "Không hoạt động" },
    { value: ENUM_USER_STATUS.BLOCKED, label: "Đã chặn" },
  ];

  const customerColumns = useMemo(() => {
    return getCustomerColumns({
      currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
      pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
      onEdit: handleEditCustomer,
      onDelete: handleDeleteCustomer,
      onView: (id) =>
        navigate(`${ROUTER_PATH.CUSTOMERS_DETAIL.replace(":id", id)}`),
    });
  }, [handleEditCustomer, handleDeleteCustomer, pagination]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar
        onSearchChange={handleSearchChange}
        searchValue={search ?? ""}
        placeholderSearch="Tìm kiếm theo tên, email..."
      >
        <div className="flex items-center justify-between gap-3">
          <SelectOption
            placeholder="Giới tính"
            value={filters.gender || "all"}
            onChange={handleGenderFilterChange}
            options={genderOptions}
            className="w-[130px] xs:w-[160px]"
            allowClear
          />
          <SelectOption
            placeholder="Trạng thái"
            value={filters.status || "all"}
            onChange={handleStatusFilterChange}
            options={statusOptions}
            className="w-[130px] xs:w-[160px]"
            allowClear
          />
        </div>
      </TableToolbar>

      <Table
        dataSource={customers}
        columns={customerColumns}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.perPage,
          total: paginationState?.total ?? 0,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
};

export default CustomerList;
