import { Card, Button, Tag } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CareRecordCardProps, ENUM_PAYMENT_STATUS } from "../types";
import { statusColors, statusLabels } from "../constants/care-record";

export default function CareRecordCard({
  record,
  onView,
  vehicleModelMap,
}: CareRecordCardProps & {
  vehicleModelMap: Record<string, string>;
}) {
  const {
    appointment,
    userVehicle,
    receivedAt,
    handoverTime,
    status,
    paymentStatus,
    totalCost,
  } = record;

  const vehicleName =
    vehicleModelMap[String(userVehicle.vehicleModel)] || "Không rõ";

  return (
    <Card
      hoverable
      cover={
        <img
          alt={userVehicle.licensePlate}
          src={userVehicle.photo || "/images/image-holder-icon.png"}
          className="h-40 object-cover rounded-t-xl"
        />
      }
      className="rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden !p-0"
      actions={[
        <Button
          key="view"
          icon={<EyeOutlined />}
          type="default"
          onClick={onView}
        >
          Chi tiết
        </Button>,
      ]}
    >
      <Card.Meta
        title={
          <span className="font-semibold text-gray-900">{vehicleName}</span>
        }
        description={
          <div className="text-gray-600 text-sm !space-y-1 mt-1">
            <p>
              <span className="font-medium text-gray-700">Tên khách hàng:</span>{" "}
              {appointment.name}
            </p>
            <p>
              <span className="font-medium text-gray-700">Biển số:</span>{" "}
              {userVehicle.licensePlate || "-"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Màu xe:</span>{" "}
              {userVehicle.color && <Tag color="blue">{userVehicle.color}</Tag>}
            </p>
            <p>
              <span className="font-medium text-gray-700">Tiếp nhận:</span>{" "}
              {dayjs(receivedAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <span className="font-medium text-gray-700">Bàn giao:</span>{" "}
              {handoverTime
                ? dayjs(handoverTime).format("DD/MM/YYYY HH:mm")
                : "-"}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Trạng thái:</span>
              <Tag
                color={statusColors[status]}
                className="font-semibold py-1 px-3 rounded-full"
              >
                {statusLabels[status]}
              </Tag>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Thanh toán:</span>
              <Tag
                color={
                  paymentStatus === ENUM_PAYMENT_STATUS.PAID ? "green" : "red"
                }
                className="font-semibold py-1 px-3 rounded-full"
              >
                {paymentStatus === ENUM_PAYMENT_STATUS.PAID
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </Tag>
            </p>
            {totalCost !== undefined && (
              <p>
                <span className="font-medium text-gray-700">Tổng chi phí:</span>{" "}
                {totalCost.toLocaleString()} ₫
              </p>
            )}
          </div>
        }
      />
    </Card>
  );
}
