import { Button, Image } from "antd";
import { Wrench, CheckCircle, X } from "lucide-react";
import moment from "moment";
import { Appointment } from "@/types/Appointment";

interface Props {
  appointment: Appointment;
  getCustomerName: (id: string) => string;
  getEmployeeName: (id: string | null) => string;
  getStatus: (status: string) => string;
  onAccept: (id: number) => void;
  getVehicle: (id: string) => any;
  loading?: boolean;
}

export default function MaintenanceWaitingCard({
  appointment,
  getCustomerName,
  getEmployeeName,
  getStatus,
  onAccept,
  getVehicle,
  loading,
}: Props) {
  const isDisabled = !!appointment.employee_id;
  const vehicle = getVehicle(appointment.vehicle_id);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all flex flex-col h-full border border-gray-100">
      <div>
        <Image
          src={vehicle?.image_file_name}
          alt={appointment.name}
          width="100%"
          height={160}
          className="rounded-t-xl object-cover w-full h-[160px] mb-0"
          style={{ objectFit: "cover" }}
          fallback="/images/image-holder-icon.png"
        />
        <div className="p-4">
          <h3 className="text-base font-bold mb-1 text-gray-800">
            {appointment.name}
          </h3>
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Khách hàng:</span>{" "}
            {getCustomerName(appointment.customer_id)}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Nhân viên phụ trách:</span>{" "}
            {getEmployeeName(appointment.employee_id)}
          </div>
          <div className="text-sm text-gray-500 mb-2">
            <span className="font-medium">Ngày bảo dưỡng gần nhất:</span>{" "}
            {moment(appointment.last_service_date).format("DD-MM-YYYY")}
          </div>
          <div
            className={`
    flex items-center gap-2 text-sm font-medium rounded-full px-3 py-1 mb-2 w-fit
    ${
      appointment.status === "prepare"
        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
        : appointment.status === "wait_for_execution"
          ? "bg-orange-100 text-orange-700 border border-orange-300"
          : appointment.status === "in_progress"
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : appointment.status === "is_done"
              ? "bg-green-100 text-green-700 border border-green-300"
              : appointment.status === "cancelled"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-gray-100 text-gray-500 border border-gray-200"
    }
  `}
          >
            {appointment.status === "prepare" && (
              <Wrench size={16} className="text-yellow-500" />
            )}
            {appointment.status === "wait_for_execution" && (
              <Wrench size={16} className="text-orange-500" />
            )}
            {appointment.status === "in_progress" && (
              <CheckCircle size={16} className="text-blue-500" />
            )}
            {appointment.status === "is_done" && (
              <CheckCircle size={16} className="text-green-500" />
            )}
            {appointment.status === "cancelled" && (
              <X size={16} className="text-red-500" />
            )}
            {getStatus(appointment.status)}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 mt-auto">
        <Button
          onClick={() => onAccept(appointment.id)}
          className={`w-full flex items-center justify-center py-2 rounded-lg font-semibold transition text-white
            ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed border-none"
                : "bg-green-500 hover:bg-green-600 border-none"
            }
          `}
          type="primary"
          disabled={isDisabled}
          size="large"
          loading={loading}
        >
          {isDisabled ? (
            <span className="flex items-center justify-center">
              <X className="mr-2" size={18} />
              Đã được nhận
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <CheckCircle className="mr-2" size={18} />
              Nhận lịch
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
