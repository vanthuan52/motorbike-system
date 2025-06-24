import { useCallback, useMemo, useState } from "react";
import { Button, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";

import { mockDataTableVehicleCompany } from "@/modules/vehicle-company/mocks/vehicle-company";
import { GreenSwitch } from "@/components/ui/switch";
import { ROUTER_PATH } from "@/constants/router-path";
import {
  ENUM_PART_TYPE_STATUS,
  PartType,
  PartTypePaginationQuery,
} from "../types";
import { partTypeActions } from "../store/part-types-slice";

interface UsePartTypeTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const usePartTypeTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UsePartTypeTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [partTypeToDelete, setPartTypeToDelete] = useState<PartType | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((PartType: PartType) => {
    setPartTypeToDelete(PartType);
    setIsConfirmModalVisible(true);
  }, []);
  const handleConfirmDelete = useCallback(async () => {
    if (partTypeToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          partTypeActions.deletePartType({ partTypeId: partTypeToDelete._id })
        );
        dispatch(
          partTypeActions.getPartType({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as PartTypePaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete PartType:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setPartTypeToDelete(null);
      }
    }
  }, [partTypeToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setPartTypeToDelete(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (checked: boolean, record: PartType) => {
      dispatch(
        partTypeActions.updatePartTypeStatus({
          partTypeId: record._id,
          status: checked
            ? ENUM_PART_TYPE_STATUS.ACTIVE
            : ENUM_PART_TYPE_STATUS.INACTIVE,
        })
      );
    },
    [dispatch]
  );
  const vehicleCompanyMap = useMemo(
    () =>
      Object.fromEntries(
        mockDataTableVehicleCompany.map((item) => [item.id, item.name])
      ),
    []
  );
  const columns: ColumnsType<PartType> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: PartType, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên danh mục",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Mã hãng xe",
        dataIndex: "vehicle_company_id",
        key: "vehicle_company_id",
        render: (value: string) => vehicleCompanyMap[value] || value,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (value: string) => (
          <span className="line-clamp-2">{value}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_PART_TYPE_STATUS, record: PartType) => (
          <GreenSwitch
            checked={status === ENUM_PART_TYPE_STATUS.ACTIVE}
            onChange={(checked) => handleUpdateStatus(checked, record)}
          />
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: PartType) => (
          <div className="flex items-center justify-items-center gap-1">
            <Tooltip title="Sửa">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.PART_TYPE_DETAILS.replace(":id", record._id)}`
                  )
                }
              />
            </Tooltip>
            <Tooltip title="Sửa">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.PART_TYPE_DETAILS.replace(":id", record._id)}?edit=1`
                  )
                }
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
      title: "Xác nhận xóa danh mục",
      message: partTypeToDelete ? (
        <>
          Bạn chắc chắn muốn xóa danh mục{" "}
          <span className="font-semibold">{partTypeToDelete.name}</span> không?
          Hành động này không thể hoàn tác.
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
