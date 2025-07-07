import { useMemo } from "react";
import { Button, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { ServicePrice } from "../types";
import { dateHelper } from "@/utils/datetime.utils";
import { useServicePriceDelete } from "./use-service-price-delete";

import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

type Props = {
  onEditClick: (id: string) => void;
};

export const useServicePriceTableColumns = ({ onEditClick }: Props) => {
  const { confirmModalProps, handleDeleteClick } = useServicePriceDelete();

  const columns: ColumnsType<ServicePrice> = useMemo(
    () => [
      {
        title: "ID",
        key: "index",
        render: (_: any, __: ServicePrice, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Dòng xe",
        dataIndex: ["vehicleModel", "fullName"],
        key: "vehicleModel",
      },
      {
        title: "Dịch vụ",
        dataIndex: ["vehicleService", "name"],
        key: "vehicleService",
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Trạng thái",
        key: "status",
        render: (_: any, record: ServicePrice) => {
          const isActive =
            !record.dateEnd || dayjs().isSameOrBefore(record.dateEnd, "day");
          return (
            <Tag color={isActive ? "green" : "red"}>
              {isActive ? "Đang áp dụng" : "Hết hiệu lực"}
            </Tag>
          );
        },
      },
      {
        title: "Hiệu lực từ",
        dataIndex: "dateStart",
        render: (value) => (
          <span>{dateHelper.formatDateToVietnamese(value)}</span>
        ),
      },
      {
        title: "Hiệu lực đến",
        dataIndex: "dateEnd",
        render: (value) => (
          <span>{dateHelper.formatDateToVietnamese(value)}</span>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: ServicePrice) => (
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
    [handleDeleteClick, onEditClick]
  );

  return { columns, confirmModalProps };
};
