import { Pagination, Spin, Empty } from "antd";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { useUserVehicleOptions } from "../hooks/use-user-vehicle-option";
import { useUserVehicleTableColumns } from "../hooks/use-user-vehicle-table-columns";
import VehicleCard from "../components/vehicle-card";

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
  const { handleDeleteClick, confirmModalProps } = useUserVehicleTableColumns({
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

      {loadingList ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : UserVehicles.length === 0 ? (
        <Empty description="Không có dữ liệu" className="my-6" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4 p-4">
            {UserVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                id={vehicle._id}
                photo={vehicle.photo}
                name={vehicle.vehicleModel?.name || ""}
                licensePlate={vehicle.licensePlate}
                color={vehicle.color}
                onView={(id) =>
                  navigate(
                    `${ROUTER_PATH.USER_VEHICLE_DETAIL.replace(":id", id)}?edit=1`
                  )
                }
                onDelete={(id) =>
                  handleDeleteClick(
                    UserVehicles.find((v) => v._id === id) || vehicle
                  )
                }
              />
            ))}
          </div>

          <div className="flex justify-center mt-6 pb-4">
            <Pagination
              current={pagination.page}
              pageSize={pagination.perPage}
              total={paginationState?.total ?? 0}
              onChange={handlePageChange}
              showSizeChanger
            />
          </div>
        </>
      )}

      <ConfirmModal {...confirmModalProps} />
    </div>
  );
}
