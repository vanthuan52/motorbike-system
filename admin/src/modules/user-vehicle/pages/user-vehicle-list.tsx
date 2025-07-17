import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import { RootState } from "@/store";
import { UserVehicleActions } from "../store/user-vehicle-slice";
import { ROUTER_PATH } from "@/constants/router-path";
import { useDebounce } from "../../../hooks/useDebounce";
import { useQueryParams } from "@/hooks/use-query-params";
import usePagination from "@/hooks/use-pagination";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import { useFilters } from "@/hooks/use-filters";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption from "@/components/ui/ant-design/select-option";
import { ConfirmModal } from "@/components/ui/modal/confirm-modal";
import { UserVehiclePaginationQuery } from "../types";
import { useUserVehicleTableColumns } from "../hooks/use-user-vehicle-table-columns";
import { useUserVehicleOptions } from "../hooks/use-user-vehicle-option";

export default function UserVehicleList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [queryParams, setQueryParams] = useQueryParams();
  const {
    page: pageParam,
    perPage: limitParam,
    vehicleModel,
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

  const { columns, confirmModalProps } = useUserVehicleTableColumns({
    currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
    pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
    search: debouncedSearchTerm,
    mappedFilters: mappedFilters,
  });

  const {
    list: UserVehicles,
    loadingList,
    pagination: paginationState,
    deletion,
  } = useSelector((state: RootState) => state.userVehicle);
  const { vehicleModelOptions, loadingVehicleModel } = useUserVehicleOptions();

  useEffect(() => {
    dispatch(
      UserVehicleActions.getUserVehicles({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as UserVehiclePaginationQuery)
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

  const handleVehicleModelChange = useCallback(
    (value: string | string[] | undefined) => {
      handleFiltersChange("vehicleModel", value);
      handlePaginationChange({
        page: DEFAULT_PAGINATION_QUERY.page,
        perPage: DEFAULT_PAGINATION_QUERY.perPage,
      });
    },
    [handleFiltersChange, handlePaginationChange]
  );

  const handleCreate = () => {
    navigate(`${ROUTER_PATH.USER_VEHICLE_CREATION}`);
  };

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
            placeholder="Loại xe"
            value={filters.vehicleModel || "all"}
            onChange={handleVehicleModelChange}
            options={vehicleModelOptions}
            className="!h-10 w-40 xs:w-50"
            loading={loadingVehicleModel}
            allowClear
          />
        </div>
      </TableToolbar>

      <Table
        dataSource={UserVehicles}
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
