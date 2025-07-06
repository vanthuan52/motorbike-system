import { useMemo } from "react";
import { ColumnsType } from "antd/es/table";
import { VehiclePart, ENUM_PART_STATUS } from "../types";
import { useDeletePart } from "./use-delete-vehicle-part";
import { Button, Tag, Tooltip } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

type Props = {
  onEditClick: (id: string) => void;
  page: number;
  perPage: number;
};

export const useVehiclePartTableColumns = ({
  onEditClick,
  page,
  perPage,
}: Props) => {
  const { confirmModalProps, handleDeleteClick } = useDeletePart();

  const columns: ColumnsType<VehiclePart> = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        render: (_: any, __: VehiclePart, index: number) => (
          <span>{(page - 1) * perPage + index + 1}</span>
        ),
      },
      {
        title: "Tên phụ tùng",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Slug",
        dataIndex: "slug",
        key: "slug",
      },
      {
        title: "Loại phụ tùng",
        dataIndex: ["partType", "name"],
        key: "partType",
      },
      {
        title: "Hãng xe",
        dataIndex: ["vehicleBrand", "name"],
        key: "vehicleBrand",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (value: ENUM_PART_STATUS) => (
          <Tag color={value === ENUM_PART_STATUS.ACTIVE ? "green" : "red"}>
            {value === ENUM_PART_STATUS.ACTIVE
              ? "Đang áp dụng"
              : "Ngừng áp dụng"}
          </Tag>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: VehiclePart) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Sửa">
              <Button
                icon={<EyeOutlined />}
                onClick={() => onEditClick(record._id)}
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
    [handleDeleteClick, onEditClick, page, perPage]
  );

  return { columns, confirmModalProps };
};
