import { useCallback, useMemo, useState } from "react";
import { Button, Tooltip } from "antd";
import { useAppDispatch } from "@/store";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FilterOptions } from "@/hooks/use-filters";
import { ROUTER_PATH } from "@/constants/router-path";
import { Appointments, ENUM_APPOINTMENTS_STATUS } from "../types";
import { AppointmentsActions } from "../store/appointment-slice";
import dayjs from "dayjs";

interface UseAppointmentsTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}
export const useAppointmentsTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseAppointmentsTableColumnsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [AppointmentsToDelete, setAppointmentsToDelete] =
    useState<Appointments | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((Appointments: Appointments) => {
    setAppointmentsToDelete(Appointments);
    setIsConfirmModalVisible(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (AppointmentsToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          AppointmentsActions.deleteAppointment({
            appointmentId: AppointmentsToDelete._id,
          })
        );
        dispatch(
          AppointmentsActions.getAppointments({
            page: currentPage,
            perPage: pageSize,
            // filters: mappedFilters,
          })
        );
        setIsDeleting(false);
      } catch (error) {}
      setIsConfirmModalVisible(false);
    }
  }, [
    AppointmentsToDelete,
    dispatch,
    currentPage,
    pageSize,
    search,
    mappedFilters,
  ]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setAppointmentsToDelete(null);
  }, []);
  const handleViewClick = useCallback((Appointments: Appointments) => {
    navigate(`${ROUTER_PATH.APPOINTMENTS}/${Appointments._id}`);
  }, []);

  const handleEditClick = useCallback((Appointments: Appointments) => {
    navigate(`${ROUTER_PATH.APPOINTMENTS}/${Appointments._id}`);
  }, []);

  const columns: ColumnsType<Appointments> = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "index",
        key: "index",
        render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: "Khách hàng",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "SỐ điện thoại",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Ngày hẹn",
        dataIndex: "appointmentDate",
        key: "appointmentDate",
        render: (appointmentDate: Date) => (
          <span>{dayjs(appointmentDate).format("DD/MM/YYYY HH:mm")}</span>
        ),
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ENUM_APPOINTMENTS_STATUS) =>
          status === "pending"
            ? "Đang chờ"
            : status === "upcoming"
              ? "Sắp tới"
              : status === "done"
                ? "Đã tiếp nhận"
                : "Không rõ",
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <div className="flex gap-2">
            <Tooltip title="View">
              <Button
                icon={<EyeOutlined />}
                onClick={() => handleViewClick(record)}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteClick(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleDeleteClick, handleEditClick, handleViewClick]
  );

  return {
    columns,
    confirmModalProps: {
      isVisible: isConfirmModalVisible,
      title: "Xác nhận xóa danh mục",
      message: AppointmentsToDelete ? (
        <>
          Bạn chắc chắn muốn xóa lịch hẹn này không? Hành động này không thể
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
