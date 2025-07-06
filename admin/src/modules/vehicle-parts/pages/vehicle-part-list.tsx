import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQueryParams } from "@/hooks/use-query-params";
import { RootState } from "@/store";
import Table from "@/components/ui/table/table";
import { useVehiclePartOptions } from "../hooks/use-vehicle-part-options";
import { usePartModal } from "../hooks/use-vehicle-part-modal";
import { useVehiclePartActions } from "../hooks/use-vehicle-part-action";
import { useVehiclePartTableColumns } from "../hooks/use-vehicle-part-table-columns";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption from "@/components/ui/ant-design/select-option";
import { ConfirmModal } from "@/components/ui/modal/confirm-modal";
import RightDrawerModal from "@/components/ui/right-drawer-modal/right-drawer-modal";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import { useVehiclePartFilters } from "../hooks/use-vehicle-part-filter";
import VehiclePartForm from "../components/vehicle-part-form";

export default function VehiclePartList() {
  const [queryParams, setQueryParams] = useQueryParams();

  const {
    filters,
    mappedFilters,
    handleFiltersChange,
    pagination,
    handlePaginationChange,
  } = useVehiclePartFilters(queryParams);

  const {
    list: vehicleParts,
    loadingList,
    pagination: paginationState,
    create,
    update,
    deletion,
    detail: partDetail,
    loadingSingle,
  } = useSelector((state: RootState) => state.vehicleParts);

  const {
    vehicleBrandOptions,
    loadingVehicleBrands,
    partTypeOptions,
    loadingPartTypes,
  } = useVehiclePartOptions();

  const modal = usePartModal(partDetail, loadingSingle);

  const { fetchVehicleParts } = useVehiclePartActions({
    pagination,
    mappedFilters,
  });
  const { columns, confirmModalProps } = useVehiclePartTableColumns({
    onEditClick: modal.openEdit,
    page: pagination.page,
    perPage: pagination.perPage,
  });

  useEffect(() => {
    fetchVehicleParts();
  }, [fetchVehicleParts, deletion.success, create.success, update.success]);

  const handlePageChange = useCallback(
    (page: number, perPage: number) => {
      handlePaginationChange({ page, perPage });
    },
    [handlePaginationChange]
  );

  const handleFilterChange = useCallback(
    (field: string) => (value: string | string[] | undefined) => {
      const newFilters = { ...filters, [field]: value };
      handleFiltersChange(field, value);
      handlePaginationChange({ page: 1, perPage: 10 });

      setQueryParams({
        ...newFilters,
        page: DEFAULT_PAGINATION_QUERY.page.toString(),
        perPage: DEFAULT_PAGINATION_QUERY.perPage.toString(),
      });
    },
    [filters, handleFiltersChange, handlePaginationChange, setQueryParams]
  );
  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar onAddNewClick={modal.openCreate}>
        <div className="flex items-center justify-between gap-3">
          <SelectOption
            placeholder="Dòng xe"
            value={filters.vehicleBrand || undefined}
            onChange={handleFilterChange("vehicleBrand")}
            options={vehicleBrandOptions}
            className="!h-10 w-60 xs:w-80"
            loading={loadingVehicleBrands}
            allowClear
          />
          <SelectOption
            placeholder="Loại phụ tùng"
            value={filters.partType || undefined}
            onChange={handleFilterChange("partType")}
            options={partTypeOptions}
            className="!h-10 w-60 xs:w-80"
            loading={loadingPartTypes}
            allowClear
          />
        </div>
      </TableToolbar>
      <Table
        dataSource={vehicleParts}
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

      <RightDrawerModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={
          modal.mode === ENUM_PAGE_MODE.CREATE
            ? "Tạo mới phụ tùng"
            : "Cập nhật phụ tùng"
        }
        width="800px"
      >
        {(modal.mode === ENUM_PAGE_MODE.CREATE ||
          (modal.mode === ENUM_PAGE_MODE.EDIT &&
            !modal.loading &&
            modal.initialValues)) && (
          <VehiclePartForm
            mode={modal.mode}
            initialValues={modal.initialValues}
            onSuccess={modal.close}
          />
        )}
        {modal.mode === ENUM_PAGE_MODE.EDIT && modal.loading && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Đang tải dữ liệu...
          </div>
        )}
      </RightDrawerModal>
    </div>
  );
}
