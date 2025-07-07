import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { Button, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { GreenSwitch } from "@/components/ui/switch";
import { ROUTER_PATH } from "@/constants/router-path";
import {
  ENUM_VEHICLE_SERVICE_STATUS,
  VehicleService,
  VehicleServicePaginationQuery,
} from "../types";
import { vehicleServiceActions } from "../store/vehicle-service-slice";

interface UseVehicleServiceTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useVehicleServiceTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseVehicleServiceTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [vehicleServiceToDelete, setVehicleServiceToDelete] =
    useState<VehicleService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((vehicleService: VehicleService) => {
    setVehicleServiceToDelete(vehicleService);
    setIsConfirmModalVisible(true);
  }, []);
  const handleConfirmDelete = useCallback(async () => {
    if (vehicleServiceToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          vehicleServiceActions.deleteVehicleService({
            vehicleServiceId: vehicleServiceToDelete._id,
          })
        );
        dispatch(
          vehicleServiceActions.getVehicleServices({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as VehicleServicePaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete vehicle service:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setVehicleServiceToDelete(null);
      }
    }
  }, [vehicleServiceToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setVehicleServiceToDelete(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (checked: boolean, record: VehicleService) => {
      dispatch(
        vehicleServiceActions.updateVehicleServiceStatus({
          vehicleServiceId: record._id,
          status: checked
            ? ENUM_VEHICLE_SERVICE_STATUS.ACTIVE
            : ENUM_VEHICLE_SERVICE_STATUS.INACTIVE,
        })
      );
    },
    [dispatch]
  );

  const columns: ColumnsType<VehicleService> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: VehicleService, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên danh mục",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Danh mục",
        dataIndex: ["serviceCategory", "name"],
        key: "serviceCategoryName",
        render: (categoryName: string) => (
          <span className="line-clamp-2">{categoryName}</span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (
          status: ENUM_VEHICLE_SERVICE_STATUS,
          record: VehicleService
        ) => (
          <GreenSwitch
            checked={status === ENUM_VEHICLE_SERVICE_STATUS.ACTIVE}
            onChange={(checked) => handleUpdateStatus(checked, record)}
          />
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: VehicleService) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Quản lý giá">
              <Button
                icon={<DollarSign size={16} />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.VEHICLE_SERVICE_PRICES.replace(":id", record._id)}?name=${record.name}`
                  )
                }
              />
            </Tooltip>
            <Tooltip title="Sửa">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.VEHICLE_SERVICE_DETAIL.replace(":id", record._id)}?edit=1`
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
      title: "Xác nhận xóa dịch vụ",
      message: vehicleServiceToDelete ? (
        <>
          Bạn chắc chắn muốn xóa dịch vụ{" "}
          <span className="font-semibold">{vehicleServiceToDelete.name}</span>{" "}
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
