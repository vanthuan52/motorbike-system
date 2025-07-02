import { useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import { RootState } from "@/store";
import { vehicleModelActions } from "../store/vehicle-model-slice";
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
  VehicleModelPaginationQuery,
  ENUM_VEHICLE_MODEL_STATUS,
} from "../types";
import { useVehicleModelTableColumns } from "../hooks/use-vehicle-model-table-columns";
import { vehicleBrandActions } from "@/modules/vehicle-brand/store/vehicle-brand-slice";

export default function VehicleModelList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [queryParams, setQueryParams] = useQueryParams();
  const {
    page: pageParam,
    perPage: limitParam,
    serviceCategory,
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

  const { columns, confirmModalProps } = useVehicleModelTableColumns({
    currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
    pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
    search: debouncedSearchTerm,
    mappedFilters: mappedFilters,
  });

  const {
    list: vehicleModels,
    loadingList,
    pagination: paginationState,
    deletion,
  } = useSelector((state: RootState) => state.vehicleModel);

  const { list: vehicleBrands, loadingList: loadingVehicleBrands } =
    useSelector((state: RootState) => state.vehicleBrand);

  useEffect(() => {
    if (!vehicleBrands || vehicleBrands.length === 0) {
      dispatch(
        vehicleBrandActions.getVehicleBrands({
          page: 1,
          perPage: 1000,
        })
      );
    }
  }, [dispatch, vehicleBrands]);

  useEffect(() => {
    dispatch(
      vehicleModelActions.getVehicleModels({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as VehicleModelPaginationQuery)
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

  const handleVehicleBrandChange = useCallback(
    (value: string | string[] | undefined) => {
      handleFiltersChange("vehicleBrand", value);
      handlePaginationChange({
        page: DEFAULT_PAGINATION_QUERY.page,
        perPage: DEFAULT_PAGINATION_QUERY.perPage,
      });
    },
    [handleFiltersChange, handlePaginationChange]
  );

  const handleStatusFilterChange = useCallback(
    (value: string | string[] | undefined) => {
      handleFiltersChange("status", value);
      handlePaginationChange({
        page: DEFAULT_PAGINATION_QUERY.page,
        perPage: DEFAULT_PAGINATION_QUERY.perPage,
      });
    },
    []
  );

  const handleCreate = () => {
    navigate(`${ROUTER_PATH.VEHICLE_MODEL_CREATION}`);
  };

  const vehicleBrandOptions: SelectOptionItem[] = useMemo(() => {
    const options: SelectOptionItem[] = [];
    if (vehicleBrands) {
      vehicleBrands.forEach((brand) => {
        options.push({ value: brand._id, label: brand.name });
      });
    }
    return options;
  }, [vehicleBrands]);

  const statusOptions: SelectOptionItem[] = [
    { value: ENUM_VEHICLE_MODEL_STATUS.ACTIVE, label: "Hoạt động" },
    { value: ENUM_VEHICLE_MODEL_STATUS.INACTIVE, label: "Không hoạt động" },
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
            placeholder="Hãng xe"
            value={filters.vehicleBrand || "all"}
            onChange={handleVehicleBrandChange}
            options={vehicleBrandOptions}
            className="!h-10 w-40 xs:w-50"
            loading={loadingVehicleBrands}
            allowClear
          />
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
        dataSource={vehicleModels}
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
