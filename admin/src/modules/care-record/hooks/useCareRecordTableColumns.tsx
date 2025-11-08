import { useCallback, useMemo, useState } from "react";
import { Button, Tag, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { GreenSwitch } from "@/components/ui/switch";
import { ROUTER_PATH } from "@/constants/router-path";
import {
  ENUM_CARE_RECORD_STATUS,
  CareRecord,
  CareRecordPaginationQuery,
  ENUM_PAYMENT_STATUS,
} from "../types";
import { careRecordActions } from "../store/care-record-slice";
import { useCareRecordOptions } from "./care-record-options";
import dayjs from "dayjs";
import { statusColors, statusLabels } from "../constants/care-record";

interface UseCareRecordTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useCareRecordTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseCareRecordTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [CareRecordToDelete, setCareRecordToDelete] =
    useState<CareRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((CareRecord: CareRecord) => {
    setCareRecordToDelete(CareRecord);
    setIsConfirmModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (CareRecordToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          careRecordActions.deleteCareRecord({
            careRecordId: CareRecordToDelete._id,
          })
        );
        dispatch(
          careRecordActions.getCareRecords({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as CareRecordPaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete CareRecord:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setCareRecordToDelete(null);
      }
    }
  }, [
    CareRecordToDelete,
    dispatch,
    currentPage,
    pageSize,
    search,
    mappedFilters,
  ]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setCareRecordToDelete(null);
  }, []);
  const { vehicleModelMap } = useCareRecordOptions();

  const columns: ColumnsType<CareRecord> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: CareRecord, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên xea",
        dataIndex: ["appointment", "vehicleModel"],
        key: "vehicleModel",
        render: (vehicleModelId: string) => (
          <span>{vehicleModelMap[vehicleModelId] || "Không rõ"}</span>
        ),
      },
      {
        title: "Tên khách hàng",
        dataIndex: ["appointment", "name"],
        key: "customerName",
      },
      {
        title: "Tiếp nhận lúc",
        dataIndex: "receivedAt",
        key: "receivedAt",
        render: (value: string) => (
          <span>{dayjs(value).format("DD/MM/YYYY HH:mm")}</span>
        ),
      },
      {
        title: "Bàn giao lúc",
        dataIndex: "handoverTime",
        key: "handoverTime",
        render: (value: string) => (
          <span>{dayjs(value).format("DD/MM/YYYY HH:mm")}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_CARE_RECORD_STATUS) => (
          <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
        ),
      },

      {
        title: "Thanh toán",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: (status: ENUM_PAYMENT_STATUS) => (
          <Tag color={status === ENUM_PAYMENT_STATUS.PAID ? "green" : "red"}>
            {status === ENUM_PAYMENT_STATUS.PAID
              ? "Đã thanh toán"
              : "Chưa thanh toán"}
          </Tag>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: CareRecord) => (
          <div className="flex items-center justify-items-center gap-1">
            <Tooltip title="Xem">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.CARE_RECORD_DETAIL.replace(":id", record._id)}`
                  )
                }
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [navigate, vehicleModelMap]
  );

  return {
    columns,
    vehicleModelMap,
    confirmModalProps: {
      isVisible: isConfirmModalVisible,
      title: "Xác nhận xóa cửa hàng",
      message: CareRecordToDelete ? (
        <>
          Bạn chắc chắn muốn xóa hồ sơ chăm sóc không? Hành động này không thể
          hoàn tác.
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
