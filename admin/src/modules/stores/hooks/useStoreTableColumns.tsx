import { useCallback, useMemo, useState } from "react";
import { Button, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { GreenSwitch } from "@/components/ui/switch";
import { ROUTER_PATH } from "@/constants/router-path";
import { ENUM_STORE_STATUS, Store, StorePaginationQuery } from "../types";
import { storeActions } from "../store/stores-slice";

interface UseStoreTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useStoreTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseStoreTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((store: Store) => {
    setStoreToDelete(store);
    setIsConfirmModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (storeToDelete) {
      setIsDeleting(true);
      try {
        dispatch(storeActions.deleteStore({ storeId: storeToDelete._id }));
        dispatch(
          storeActions.getStore({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as StorePaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete Store:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setStoreToDelete(null);
      }
    }
  }, [storeToDelete, dispatch, currentPage, pageSize, search, mappedFilters]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setStoreToDelete(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (checked: boolean, record: Store) => {
      dispatch(
        storeActions.updateStoreStatus({
          storeId: record._id,
          status: checked
            ? ENUM_STORE_STATUS.ACTIVE
            : ENUM_STORE_STATUS.INACTIVE,
        })
      );
    },
    [dispatch]
  );

  const columns: ColumnsType<Store> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: Store, index: number) => <span>{index + 1}</span>,
      },
      {
        title: "Tên cửa hàng",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Slug",
        dataIndex: "slug",
        key: "slug",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        render: (value: string) => (
          <span className='line-clamp-2'>{value}</span>
        ),
      },
      {
        title: "Giờ làm việc",
        dataIndex: "workHours",
        key: "workHours",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_STORE_STATUS, record: Store) => (
          <GreenSwitch
            checked={status === ENUM_STORE_STATUS.ACTIVE}
            onChange={checked => handleUpdateStatus(checked, record)}
          />
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: Store) => (
          <div className='flex items-center justify-items-center gap-1'>
            <Tooltip title='Xem'>
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.STORE_DETAILS.replace(":id", record._id)}`
                  )
                }
              />
            </Tooltip>
            <Tooltip title='Sửa'>
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.STORE_DETAILS.replace(":id", record._id)}?edit=1`
                  )
                }
              />
            </Tooltip>
            <Tooltip title='Xóa'>
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
    [currentPage, pageSize, navigate, handleDeleteClick, handleUpdateStatus]
  );

  return {
    columns,
    confirmModalProps: {
      isVisible: isConfirmModalVisible,
      title: "Xác nhận xóa cửa hàng",
      message: storeToDelete ? (
        <>
          Bạn chắc chắn muốn xóa cửa hàng{" "}
          <span className='font-semibold'>{storeToDelete.name}</span> không?
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
