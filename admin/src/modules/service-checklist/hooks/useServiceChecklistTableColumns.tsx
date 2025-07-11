import { useCallback, useMemo, useState } from "react";
import { Button, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { useAppDispatch } from "@/store";
import {
  ENUM_SERVICE_CHECKLIST_AREA,
  ServiceChecklist,
  ServiceChecklistPaginationQuery,
} from "../types";
import { serviceChecklistActions } from "../store/service-checklist-slice";
import { SERVICE_CHECKLIST_AREA_LABEL_MAP } from "../constants/service-checklist.constant";

interface UseServiceChecklistTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
  onEditClick: (id: string) => void;
}

export const useServiceChecklistTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
  onEditClick,
}: UseServiceChecklistTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [serviceChecklistToDelete, setServiceChecklistToDelete] =
    useState<ServiceChecklist | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback(
    (serviceChecklist: ServiceChecklist) => {
      setServiceChecklistToDelete(serviceChecklist);
      setIsConfirmModalVisible(true);
    },
    []
  );
  const handleConfirmDelete = useCallback(async () => {
    if (serviceChecklistToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          serviceChecklistActions.deleteServiceChecklist({
            serviceChecklistId: serviceChecklistToDelete._id,
          })
        );
        dispatch(
          serviceChecklistActions.getServiceChecklistList({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as ServiceChecklistPaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete service checklist:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setServiceChecklistToDelete(null);
      }
    }
  }, [serviceChecklistToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setServiceChecklistToDelete(null);
  }, []);

  const columns: ColumnsType<ServiceChecklist> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: ServiceChecklist, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên công việc",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Thứ tự",
        dataIndex: "order",
        key: "order",
        render: (value: string) => (
          <span className="line-clamp-2">{value}</span>
        ),
      },
      {
        title: "Vị trí",
        dataIndex: "area",
        key: "area",
        render: (area: ENUM_SERVICE_CHECKLIST_AREA) => (
          <span className="line-clamp-2">
            {SERVICE_CHECKLIST_AREA_LABEL_MAP[area] || area}
          </span>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: ServiceChecklist) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Xem">
              <Button
                icon={<EyeOutlined />}
                onClick={() => onEditClick(record._id)}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteClick(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [currentPage, pageSize, navigate, handleDeleteClick]
  );
  return {
    columns,
    confirmModalProps: {
      isVisible: isConfirmModalVisible,
      title: "Xác nhận xóa công việc",
      message: serviceChecklistToDelete ? (
        <>
          Bạn chắc chắn muốn xóa công việc{" "}
          <span className="font-semibold">{serviceChecklistToDelete.name}</span>{" "}
          không? Hành động này không thể hoàn tác.
        </>
      ) : (
        "Bạn chắc chắn muốn thực hiện hành động này?"
      ),
      onConfirm: handleConfirmDelete,
      onCancel: handleCancelDelete,
      confirmText: "Xóa",
      cancelText: "Hủy",
      confirmLoading: isDeleting,
      danger: true,
    },
  };
};
