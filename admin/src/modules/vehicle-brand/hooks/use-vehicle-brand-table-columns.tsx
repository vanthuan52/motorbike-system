import { useCallback, useMemo, useState } from "react";
import { Button, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { GreenSwitch } from "@/components/ui/switch";
import { ROUTER_PATH } from "@/constants/router-path";
import {
  ENUM_VEHICLE_BRAND_STATUS,
  VehicleBrand,
  VehicleBrandPaginationQuery,
} from "../types";
import { vehicleBrandActions } from "../store/vehicle-brand-slice";

interface UseVehicleBrandTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useVehicleBrandTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseVehicleBrandTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [vehicleBrandToDelete, setVehicleBrandToDelete] =
    useState<VehicleBrand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((vehicleBrand: VehicleBrand) => {
    setVehicleBrandToDelete(vehicleBrand);
    setIsConfirmModalVisible(true);
  }, []);
  const handleConfirmDelete = useCallback(async () => {
    if (vehicleBrandToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          vehicleBrandActions.deleteVehicleBrand({
            vehicleBrandId: vehicleBrandToDelete._id,
          })
        );
        dispatch(
          vehicleBrandActions.getVehicleBrands({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as VehicleBrandPaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete vehicle brand:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setVehicleBrandToDelete(null);
      }
    }
  }, [vehicleBrandToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setVehicleBrandToDelete(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (checked: boolean, record: VehicleBrand) => {
      dispatch(
        vehicleBrandActions.updateVehicleBrandStatus({
          vehicleBrandId: record._id,
          status: checked
            ? ENUM_VEHICLE_BRAND_STATUS.ACTIVE
            : ENUM_VEHICLE_BRAND_STATUS.INACTIVE,
        })
      );
    },
    [dispatch]
  );

  const columns: ColumnsType<VehicleBrand> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: VehicleBrand, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên hãng xe",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Quốc gia",
        dataIndex: "country",
        key: "country",
        render: (value: string) => (
          <span className="line-clamp-2">{value}</span>
        ),
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
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_VEHICLE_BRAND_STATUS, record: VehicleBrand) => (
          <GreenSwitch
            checked={status === ENUM_VEHICLE_BRAND_STATUS.ACTIVE}
            onChange={(checked) => handleUpdateStatus(checked, record)}
          />
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: VehicleBrand) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Sửa">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.VEHICLE_BRAND_DETAIL.replace(":id", record._id)}`
                  )
                }
              />
            </Tooltip>
            <Tooltip title="Sửa">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.VEHICLE_BRAND_DETAIL.replace(":id", record._id)}?edit=1`
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
      title: "Xác nhận xóa hãng xe",
      message: vehicleBrandToDelete ? (
        <>
          Bạn chắc chắn muốn xóa hãng xe{" "}
          <span className="font-semibold">{vehicleBrandToDelete.name}</span>{" "}
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
