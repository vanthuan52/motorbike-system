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
  ENUM_SERVICE_CATEGORY_STATUS,
  ServiceCategory,
  ServiceCategoryPaginationQuery,
} from "../types";
import { serviceCategoryActions } from "../store/service-category-slice";

interface UseServiceCategoryTableColumnsProps {
  currentPage: number;
  pageSize: number;
  search: string | string[];
  mappedFilters: FilterOptions;
}

export const useServiceCategoryTableColumns = ({
  currentPage,
  pageSize,
  search,
  mappedFilters,
}: UseServiceCategoryTableColumnsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [serviceCategoryToDelete, setServiceCategoryToDelete] =
    useState<ServiceCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback((serviceCategory: ServiceCategory) => {
    setServiceCategoryToDelete(serviceCategory);
    setIsConfirmModalVisible(true);
  }, []);
  const handleConfirmDelete = useCallback(async () => {
    if (serviceCategoryToDelete) {
      setIsDeleting(true);
      try {
        dispatch(
          serviceCategoryActions.deleteServiceCategory({
            serviceCategoryId: serviceCategoryToDelete._id,
          })
        );
        dispatch(
          serviceCategoryActions.getServiceCategories({
            page: currentPage,
            perPage: pageSize,
            search: search,
            ...mappedFilters,
          } as ServiceCategoryPaginationQuery)
        );
      } catch (error) {
        console.error("Failed to delete service category:", error);
      } finally {
        setIsConfirmModalVisible(false);
        setIsDeleting(false);
        setServiceCategoryToDelete(null);
      }
    }
  }, [serviceCategoryToDelete, dispatch, currentPage, pageSize]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmModalVisible(false);
    setServiceCategoryToDelete(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (checked: boolean, record: ServiceCategory) => {
      dispatch(
        serviceCategoryActions.updateServiceCategoryStatus({
          serviceCategoryId: record._id,
          status: checked
            ? ENUM_SERVICE_CATEGORY_STATUS.ACTIVE
            : ENUM_SERVICE_CATEGORY_STATUS.INACTIVE,
        })
      );
    },
    [dispatch]
  );

  const columns: ColumnsType<ServiceCategory> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "index",
        key: "index",
        render: (_: any, __: ServiceCategory, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Tên danh mục",
        dataIndex: "name",
        key: "name",
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
        render: (
          status: ENUM_SERVICE_CATEGORY_STATUS,
          record: ServiceCategory
        ) => (
          <GreenSwitch
            checked={status === ENUM_SERVICE_CATEGORY_STATUS.ACTIVE}
            onChange={(checked) => handleUpdateStatus(checked, record)}
          />
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: ServiceCategory) => (
          <div className="flex items-center justify-items-center gap-1">
            <Tooltip title="Sửa">
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.SERVICE_CATEGORY_DETAILS.replace(":id", record._id)}`
                  )
                }
              />
            </Tooltip>
            <Tooltip title="Sửa">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `${ROUTER_PATH.SERVICE_CATEGORY_DETAILS.replace(":id", record._id)}?edit=1`
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
      message: serviceCategoryToDelete ? (
        <>
          Bạn chắc chắn muốn xóa danh mục{" "}
          <span className="font-semibold">{serviceCategoryToDelete.name}</span>{" "}
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
