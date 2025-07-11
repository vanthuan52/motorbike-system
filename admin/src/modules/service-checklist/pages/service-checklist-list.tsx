import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/ui/table/table";
import { RootState } from "@/store";
import { serviceChecklistActions } from "../store/service-checklist-slice";
import { useDebounce } from "../../../hooks/useDebounce";
import { useQueryParams } from "@/hooks/use-query-params";
import usePagination from "@/hooks/use-pagination";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";
import { useFilters } from "@/hooks/use-filters";
import TableToolbar from "@/components/ui/table/table-toolbar";
import SelectOption from "@/components/ui/ant-design/select-option";
import { ConfirmModal } from "@/components/ui/modal/confirm-modal";
import { ServiceChecklistPaginationQuery } from "../types";
import { useServiceChecklistTableColumns } from "../hooks/useServiceChecklistTableColumns";
import SERVICE_CHECKLIST_AREA_OPTIONS from "../constants/area";
import CenterModal from "@/components/ui/center-modal/center-modal";
import { useServiceChecklistModal } from "../hooks/user-service-checklist-modal";
import ServiceChecklistForm from "../components/service-checklist-form";

export default function ServiceChecklistList() {
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
    list: serviceChecklist,
    loadingList,
    detail: serviceChecklistDetail,
    loadingSingle,
    pagination: paginationState,
    deletion,
  } = useSelector((state: RootState) => state.serviceChecklist);

  const serviceChecklistModal = useServiceChecklistModal(
    serviceChecklistDetail,
    loadingSingle
  );

  const { columns, confirmModalProps } = useServiceChecklistTableColumns({
    currentPage: pagination.page ?? DEFAULT_PAGINATION_QUERY.page,
    pageSize: pagination.perPage ?? DEFAULT_PAGINATION_QUERY.perPage,
    search: debouncedSearchTerm,
    mappedFilters: mappedFilters,
    onEditClick: serviceChecklistModal.openEdit,
  });

  useEffect(() => {
    dispatch(
      serviceChecklistActions.getServiceChecklistList({
        page: pagination.page,
        perPage: pagination.perPage,
        search: debouncedSearchTerm,
        ...mappedFilters,
      } as ServiceChecklistPaginationQuery)
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

  const handleAreaFilterChange = useCallback(
    (value: string | string[] | undefined) => {
      handleFiltersChange("area", value);
      handlePaginationChange({
        page: DEFAULT_PAGINATION_QUERY.page,
        perPage: DEFAULT_PAGINATION_QUERY.perPage,
      });
    },
    []
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <TableToolbar
        onSearchChange={handleSearchChange}
        onAddNewClick={serviceChecklistModal.openCreate}
        searchValue={search ?? ""}
        placeholderSearch="Tìm kiếm theo tên"
      >
        <div className="flex items-center justify-between gap-3">
          <SelectOption
            placeholder="Vị trí"
            value={filters.area || "all"}
            onChange={handleAreaFilterChange}
            options={SERVICE_CHECKLIST_AREA_OPTIONS}
            className="!h-10 w-40 xs:w-50"
            allowClear
          />
        </div>
      </TableToolbar>

      <Table
        dataSource={serviceChecklist}
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

      <CenterModal
        isOpen={serviceChecklistModal.isOpen}
        onClose={serviceChecklistModal.close}
      >
        {loadingSingle ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <ServiceChecklistForm
            mode={serviceChecklistModal.mode}
            initialValues={serviceChecklistModal.initialValues}
            onSuccess={serviceChecklistModal.close}
          />
        )}
      </CenterModal>
    </div>
  );
}
