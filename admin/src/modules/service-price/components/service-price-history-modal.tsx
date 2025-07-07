import { useCallback } from "react";
import { useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { RootState } from "@/store";
import Table from "@/components/ui/table/table";
import { useQueryParams } from "@/hooks/use-query-params";
import { useServicePriceFilters } from "../hooks/use-service-price-filters";
import RightDrawerModal from "@/components/ui/right-drawer-modal/right-drawer-modal";
import { useServicePriceTableColumns } from "../hooks/use-service-price-table-columns";
import CenterModal from "@/components/ui/center-modal/center-modal";
import ServicePriceForm from "./service-price-form";
import { Button } from "antd";
import { useServicePriceModal } from "../hooks/use-service-price-modal";

interface ServicePriceHistoryListProps {
  modal: any;
}

export default function ServicePriceHistoryModal({
  modal,
}: ServicePriceHistoryListProps) {
  // @ts-ignore
  const [queryParams, setQueryParams] = useQueryParams();

  const { pagination, handlePaginationChange } =
    useServicePriceFilters(queryParams);

  const {
    loadingList,
    pagination: paginationState,
    detail: servicePriceDetail,
    loadingSingle,
  } = useSelector((state: RootState) => state.servicePrice);

  const servicePriceModal = useServicePriceModal(
    servicePriceDetail,
    loadingSingle
  );

  const { columns: servicePriceColumns } = useServicePriceTableColumns({
    onEditClick: servicePriceModal.openEdit,
  });

  const handlePageChange = useCallback(
    (page: number, perPage: number) => {
      handlePaginationChange({ page, perPage });
    },
    [handlePaginationChange]
  );

  return (
    <div>
      <RightDrawerModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={"Lịch sử giá"}
        width="800px"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={servicePriceModal.openCreate}
              className="!h-10 rounded-lg !bg-black !font-semibold"
            >
              Thêm mới
            </Button>
          </div>
          {!modal.loading && (
            <Table
              dataSource={modal.listHistory}
              columns={servicePriceColumns}
              rowKey="_id"
              loading={loadingList}
              pagination={{
                current: pagination.page,
                pageSize: pagination.perPage,
                total: paginationState?.total ?? 0,
                onChange: handlePageChange,
              }}
            />
          )}
          {modal.loading && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Đang tải dữ liệu...
            </div>
          )}
        </div>
      </RightDrawerModal>

      <CenterModal
        isOpen={servicePriceModal.isOpen}
        onClose={servicePriceModal.close}
      >
        <ServicePriceForm
          mode={servicePriceModal.mode}
          initialValues={servicePriceModal.initialValues}
          onSuccess={servicePriceModal.close}
        />
      </CenterModal>
    </div>
  );
}
