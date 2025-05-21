import { Wrench } from "lucide-react";
import moment from "moment";
import { Appointment } from "@/types/Appointment";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
interface Props {
  order: Appointment;
  getCustomerName: (id: string) => string;
  getEmployeeName: (id: string | null) => string;
  handleStatusChange: (id: number, status: string) => void;
}

export default function MaintenanceMyOrderCard({
  order,
  getCustomerName,
  getEmployeeName,
  handleStatusChange,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-start h-full">
      <div>
        <h3 className="text-lg font-semibold mb-1">{order.name}</h3>
        <p className="text-sm text-gray-500">
          Ngày gần nhất: {moment(order.last_service_date).format("DD-MM-YYYY")}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Khách hàng: {getCustomerName(order.customer_id)}
        </p>
        <p className="text-sm text-gray-500 mt-1 whitespace-nowrap">
          Nhân viên phụ trách: {getEmployeeName(order.employee_id)}
        </p>

        <div className="flex flex-row items-center gap-2 mt-2">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Trạng thái:
          </label>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(order.id, e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none "
          >
            <option value="prepare">Đang chuẩn bị</option>
            <option value="wait_for_execution">Chờ thực hiện</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="done">Đã hoàn thành</option>
            <option value="cancelled">Huỷ</option>
          </select>
        </div>
      </div>
      <CustomLink
        href={`/technician/maintenance/${order.id}`}
        >
       <Wrench
        className="text-gray-500 mt-1 cursor-pointer"
      />
      </CustomLink>
    </div>
  );
}
