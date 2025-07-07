import { useMemo } from "react";
import { Button, Tooltip } from "antd";
import dayjs from "dayjs";
import { History } from "lucide-react";
import { ColumnsType } from "antd/es/table";
import { ModelServicePrice } from "../types";
import { dateHelper } from "@/utils/datetime.utils";

import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

type Props = {
  onEditClick: (vehicleServiceId: string, vehicleModelId: string) => void;
};

export const useModelServicePriceTableColumns = ({ onEditClick }: Props) => {
  const columns: ColumnsType<ModelServicePrice> = useMemo(
    () => [
      {
        title: "ID",
        key: "index",
        render: (_: any, __: ModelServicePrice, index: number) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "Dòng xe",
        dataIndex: ["vehicleModelName"],
        key: "vehicleModelName",
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
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
        render: (_: any, record: ModelServicePrice) => (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Xem lịch sử giá">
              <Button
                icon={<History size={16} />}
                onClick={() =>
                  onEditClick(record.vehicleServiceId, record.vehicleModelId)
                }
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [onEditClick]
  );

  return { columns };
};
