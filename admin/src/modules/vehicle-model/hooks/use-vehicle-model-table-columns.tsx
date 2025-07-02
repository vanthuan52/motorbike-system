import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { GreenSwitch } from "@/components/ui/switch";
import { ROUTER_PATH } from "@/constants/router-path";
import {
  ENUM_VEHICLE_MODEL_STATUS,
  VehicleModel,
  VehicleModelPaginationQuery,
} from "../types";
import { vehicleModelActions } from "../store/vehicle-model-slice";

interface UseVehicleModelTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useVehicleModelTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseVehicleModelTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [vehicleModelToDelete, setVehicleModelToDelete] =
    useState<VehicleModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((VehicleModel: VehicleModel) => {
    setVehicleModelToDelete(VehicleModel);
    setIsConfirmModalVisible(true);
  }, []);
  const handleConfirmDelete = useCallback(async () => {
    if (vehicleModelToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          vehicleModelActions.deleteVehicleModel({
            vehicleModelId: vehicleModelToDelete._id,
          })
        );
        dispatch(
          vehicleModelActions.getVehicleModels({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as VehicleModelPaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete vehicle service:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setVehicleModelToDelete(null);
      }
    }
  }, [vehicleModelToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setVehicleModelToDelete(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (checked: boolean, record: VehicleModel) => {
      dispatch(
        vehicleModelActions.updateVehicleModelStatus({
          vehicleModelId: record._id,
          status: checked
            ? ENUM_VEHICLE_MODEL_STATUS.ACTIVE
            : ENUM_VEHICLE_MODEL_STATUS.INACTIVE,
        })
      );
    },
    [dispatch]
  );

  const columns: ColumnsType<VehicleModel> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: VehicleModel, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên dòng xe",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Hãng xe",
        dataIndex: ["vehicleBrand", "name"],
        key: "vehicleBrand",
        render: (categoryName: string) => (
          <span className="line-clamp-2">{categoryName}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_VEHICLE_MODEL_STATUS, record: VehicleModel) => (
          <GreenSwitch
            checked={status === ENUM_VEHICLE_MODEL_STATUS.ACTIVE}
            onChange={(checked) => handleUpdateStatus(checked, record)}
          />
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: VehicleModel) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Sửa">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.VEHICLE_MODEL_DETAIL.replace(":id", record._id)}`
                  )
                }
              />
            </Tooltip>
            <Tooltip title="Sửa">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.VEHICLE_MODEL_DETAIL.replace(":id", record._id)}?edit=1`
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
      title: "Xác nhận xóa dòng xe",
      message: vehicleModelToDelete ? (
        <>
          Bạn chắc chắn muốn xóa dòng xe{" "}
          <span className="font-semibold">{vehicleModelToDelete.name}</span>{" "}
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
