import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Table from "@/components/ui/table/table";
import { useQueryParams } from "@/hooks/use-query-params";
import { useServicePriceFilters } from "../hooks/use-service-price-filters";
import { useModelServicePriceActions } from "../hooks/use-model-service-price-actions";
import { useModelServicePriceTableColumns } from "../hooks/use-model-service-price-table-columns";
import { useModelServicePriceModal } from "../hooks/use-model-service-price-modal";
import ServicePriceHistoryModal from "./service-price-history-modal";

interface ModelServicePriceListProps {
  vehicleServiceId: string;
}

export default function ModelServicePriceList({
  vehicleServiceId,
}: ModelServicePriceListProps) {
  const [queryParams, setQueryParams] = useQueryParams();

  const { mappedFilters, pagination, handlePaginationChange } =
    useServicePriceFilters(queryParams);

  const {
    listForService: servicePrices,
    loadingList,
    pagination: paginationState,
  } = useSelector((state: RootState) => state.servicePrice);

  useModelServicePriceActions({
    vehicleServiceId,
    pagination,
    mappedFilters,
  });

  const modal = useModelServicePriceModal();

  const { columns } = useModelServicePriceTableColumns({
    onEditClick: modal.openEdit,
  });

  const handlePageChange = useCallback(
    (page: number, perPage: number) => {
      handlePaginationChange({ page, perPage });
    },
    [handlePaginationChange]
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Table
        dataSource={servicePrices}
        columns={columns}
        rowKey="vehicleModelId"
        loading={loadingList}
        pagination={{
          current: pagination.page,
          pageSize: pagination.perPage,
          total: paginationState?.total ?? 0,
          onChange: handlePageChange,
        }}
      />

      <ServicePriceHistoryModal modal={modal} />
    </div>
  );
}
