import { useCallback, useMemo, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  ENUM_USER_STATUS,
  User,
  UserPaginationQuery,
} from "@/modules/user/types";
import CustomerStatusTag from "../components/customer-status-tag";
import { useAppDispatch } from "@/store";
import { customerActions } from "../store/customer-slice";
import { ROUTER_PATH } from "@/constants/router-path";
import { FilterOptions } from "@/hooks/use-filters";

interface UseCustomerTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useCustomerTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseCustomerTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((customer: User) => {
    setCustomerToDelete(customer);
    setIsConfirmModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (customerToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          customerActions.deleteCustomer({ customerId: customerToDelete._id })
        );
        dispatch(
          customerActions.getCustomers({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as UserPaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete customer:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setCustomerToDelete(null);
      }
    }
  }, [customerToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setCustomerToDelete(null);
  }, []);

  const columns: ColumnsType<User> = useMemo(() => {
    return [
      {
        title: "STT",
        dataIndex: "id",
        key: "id",
        render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: "Họ tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_USER_STATUS) => (
          <CustomerStatusTag status={status} />
        ),
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        responsive: ["lg"],
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Chỉnh sửa">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.CUSTOMERS_DETAIL.replace(":id", record._id)}?edit=1`
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
    ];
  }, [currentPage, pageSize, navigate, handleDeleteClick]);

  return {
    columns,
    confirmModalProps: {
      isVisible: isConfirmModalVisible,
      title: "Xác nhận xóa khách hàng",
      message: customerToDelete ? (
        <>
          Bạn chắc chắn muốn xóa khách hàng{" "}
          <span className="font-semibold">{customerToDelete.name}</span> không?
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
