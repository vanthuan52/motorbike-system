import { useCallback, useEffect, useMemo, useState } from "react";
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

const USER_DEFAULT_QUERY: UserPaginationQuery = {
  search: "",
  page: 1,
  perPage: 5,
  status: ENUM_USER_STATUS.ACTIVE || undefined,
};

const CustomerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterQuery, setFilterQuery] =
    useState<UserPaginationQuery>(USER_DEFAULT_QUERY);
  const debouncedSearchTerm = useDebounce(filterQuery.search, 500);

  const {
    users: customers,
    loading,
    pagination,
  } = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    dispatch(
      customerActions.getCustomers({
        ...filterQuery,
        search: debouncedSearchTerm,
      } as UserPaginationQuery)
    );
  }, [
    dispatch,
    debouncedSearchTerm,
    filterQuery.page,
    filterQuery.perPage,
    filterQuery.status,
    filterQuery.gender,
  ]);

  const handlePageChange = useCallback((page: number, perPage: number) => {
    setFilterQuery((prev) => ({
      ...prev,
      page,
      perPage,
    }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setFilterQuery((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  }, []);

  const handleGenderFilterChange = useCallback((value: string | number) => {
    setFilterQuery((prev) => ({
      ...prev,
      gender: value === "all" ? undefined : (value as ENUM_USER_GENDER),
      page: 1,
    }));
  }, []);

  const handleStatusFilterChange = useCallback((value: string | number) => {
    setFilterQuery((prev) => ({
      ...prev,
      status: value === "all" ? undefined : (value as ENUM_USER_STATUS),
      page: 1,
    }));
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
      onEdit: handleEditCustomer,
      onDelete: handleDeleteCustomer,
      onView: (id) =>
        navigate(`${ROUTER_PATH.CUSTOMERS_DETAIL.replace(":id", id)}`),
    });
  }, [handleEditCustomer, handleDeleteCustomer]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar
        onSearchChange={handleSearchChange}
        searchValue={filterQuery.search}
        placeholderSearch="Tìm kiếm theo tên, email..."
      >
        <div className="flex items-center justify-between gap-3">
          <SelectOption
            placeholder="Giới tính"
            value={filterQuery.gender || "all"}
            onChange={handleGenderFilterChange}
            options={genderOptions}
            className="w-[130px] xs:w-[160px]"
            allowClear
          />
          <SelectOption
            placeholder="Trạng thái"
            value={filterQuery.status || "all"}
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
          current: pagination?.page,
          pageSize: pagination?.perPage,
          total: pagination?.total,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    </div>
  );
};

export default CustomerList;
