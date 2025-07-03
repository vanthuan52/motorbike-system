import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Table from "@/components/ui/table/table";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption from "@/components/ui/ant-design/select-option";
import { ConfirmModal } from "@/components/ui/modal/confirm-modal";
import { useQueryParams } from "@/hooks/use-query-params";
import { useServicePriceFilters } from "../hooks/use-service-price-filters";
import { useServicePriceTableColumns } from "../hooks/use-service-price-table-columns";
import { useServicePriceActions } from "../hooks/use-service-price-actions";
import { useVehicleOptions } from "../hooks/use-service-price-options";
import { useServicePriceModal } from "../hooks/use-service-price-modal";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import RightDrawerModal from "@/components/ui/right-drawer-modal/right-drawer-modal";
import { ENUM_PAGE_MODE } from "@/types/app.type";
import ServicePriceForm from "../components/service-price-form";

export default function ServicePriceList() {
  const [queryParams, setQueryParams] = useQueryParams();

  const {
    filters,
    mappedFilters,
    handleFiltersChange,
    pagination,
    handlePaginationChange,
  } = useServicePriceFilters(queryParams);

  const {
    list: servicePrices,
    loadingList,
    pagination: paginationState,
    create,
    update,
    deletion,
    detail: servicePriceDetail,
    loadingSingle,
  } = useSelector((state: RootState) => state.servicePrice);

  const {
    vehicleServiceOptions,
    vehicleModelOptions,
    loadingVehicleServices,
    loadingVehicleModels,
  } = useVehicleOptions();

  const modal = useServicePriceModal(servicePriceDetail, loadingSingle);

  const { fetchServicePrices } = useServicePriceActions({
    pagination,
    mappedFilters,
  });

  const { columns, confirmModalProps } = useServicePriceTableColumns({
    onEditClick: modal.openEdit,
  });

  useEffect(() => {
    fetchServicePrices();
  }, [fetchServicePrices, create.success, update.success, deletion.success]);

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
            value={filters.vehicleModel || undefined}
            onChange={handleFilterChange("vehicleModel")}
            options={vehicleModelOptions}
            className="!h-10 w-60 xs:w-80"
            loading={loadingVehicleModels}
            allowClear
          />
          <SelectOption
            placeholder="Dịch vụ"
            value={filters.vehicleService || undefined}
            onChange={handleFilterChange("vehicleService")}
            options={vehicleServiceOptions}
            className="!h-10 w-60 xs:w-80"
            loading={loadingVehicleServices}
            allowClear
          />
        </div>
      </TableToolbar>

      <Table
        dataSource={servicePrices}
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
            ? "Tạo mới giá dịch vụ"
            : "Cập nhật giá dịch vụ"
        }
        width="800px"
      >
        {(modal.mode === ENUM_PAGE_MODE.CREATE ||
          (modal.mode === ENUM_PAGE_MODE.EDIT &&
            !modal.loading &&
            modal.initialValues)) && (
          <ServicePriceForm
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
