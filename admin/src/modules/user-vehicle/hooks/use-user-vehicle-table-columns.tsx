import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { ROUTER_PATH } from "@/constants/router-path";
import { UserVehicle, UserVehiclePaginationQuery } from "../types";
import { UserVehicleActions } from "../store/user-vehicle-slice";
import { useUserVehicleOptions } from "./use-user-vehicle-option";

interface UseUserVehicleTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useUserVehicleTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseUserVehicleTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [UserVehicleToDelete, setUserVehicleToDelete] =
    useState<UserVehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((UserVehicle: UserVehicle) => {
    setUserVehicleToDelete(UserVehicle);
    setIsConfirmModalVisible(true);
  }, []);

  const { customer } = useUserVehicleOptions();
  const handleConfirmDelete = useCallback(async () => {
    if (UserVehicleToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          UserVehicleActions.deleteUserVehicle({
            userVehicleId: UserVehicleToDelete._id,
          })
        );
        dispatch(
          UserVehicleActions.getUserVehicles({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as UserVehiclePaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete vehicle service:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setUserVehicleToDelete(null);
      }
    }
  }, [UserVehicleToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setUserVehicleToDelete(null);
  }, []);

  const columns: ColumnsType<UserVehicle> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: UserVehicle, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Người dùng",
        dataIndex: "user",
        key: "user",
        render: (user) =>
          customer?.find((item) => item._id === user)?.name || "Không rõ",
      },
      {
        title: "Dòng xe",
        dataIndex: ["vehicleModel", "name"],
        key: "vehicleModelName",
        render: (categoryName: string) => (
          <span className="line-clamp-2">{categoryName}</span>
        ),
      },
      {
        title: "Biển số xe",
        dataIndex: "licensePlate",
        key: "licensePlate",
        render: (licensePlate: string) => (
          <span className="line-clamp-2">{licensePlate}</span>
        ),
      },
      {
        title: "Hình ảnh",
        dataIndex: "photo",
        key: "photo",
        width: 150,
        render: (photo: string) => (
          <div className="flex items-center justify-center">
            <img
              src={photo ? photo : "public/images/image-holder-icon.png"}
              alt=""
              className="w-20 h-20 object-cover"
            />
          </div>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: UserVehicle) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Sửa">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.USER_VEHICLE_DETAIL.replace(":id", record._id)}?edit=1`
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
    handleDeleteClick,
    confirmModalProps: {
      isVisible: isConfirmModalVisible,
      title: "Xác nhận xóa dịch vụ",
      message: UserVehicleToDelete ? (
        <>
          Bạn chắc chắn muốn xóa xe này không? Hành động này không thể hoàn tác.
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
