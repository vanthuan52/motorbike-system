import { Edit } from "lucide-react";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { LuComponent } from "react-icons/lu";

const appointments = [
  {
    id: 1,
    customer_name: "Trần Kim Chi",
    vehicle: "Yamaha - Exciter",
    type: "Bảo dưỡng",
    time: "10:00:00 10/05/2025",
  },
  {
    id: 2,
    customer_name: "Trần Kim Chi",
    vehicle: "Yamaha Yamaha - Exciter",
    type: "Kiểm tra xe",
    time: "14:00:00 10/05/2025",
  },
  {
    id: 3,
    customer_name: "Nguyễn Kiều Hạnh",
    vehicle: "Yamaha Yamaha - Exciter",
    type: "Sửa chửa",
    time: "16:00:00 10/05/2025",
  },
];

export default function AdminHomePage() {
  return (
    <div className="">
      <div className="overflow-auto">
        {/*Hello section*/}

        <div className="mb-5">
          <h2 className="font-bold">Xin chào, Admin</h2>
        </div>

        <div className="mb-5">
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center flex-col rounded-md w-30 text-center p-2 text-md bg-green-200 font-medium">
              <Edit size={24} />
              <span>Tiếp nhận khách hàng</span>
            </div>

            <div className="flex items-center flex-col rounded-md w-30 text-center p-2 text-md bg-green-200 font-medium">
              <RiCalendarScheduleLine size={24} />
              <span>Quản lý lịch hẹn</span>
            </div>

            <div className="flex items-center flex-col rounded-md w-30 text-center p-2 text-md bg-green-200 font-medium">
              <LuComponent size={24} />
              <span>Quản lý phụ tùng</span>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between gap-2 items-center">
            <h2 className="text-lg md:text-xl font-bold">
              Lịch hẹn của bạn hôm nay
            </h2>
            <span>Xem tất cả</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {appointments.map((item, idx) => (
              <div
                key={idx}
                className="rounded-md py-4 px-3 border border-[#ccc]"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={"/images/avatar/default-avatar.jpeg"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">
                    {item.customer_name}
                  </span>
                </div>
                <div className="mt-2 truncate overflow-hidden whitespace-nowrap">
                  Xe: {item.vehicle}
                </div>
                <div className="mt-2 truncate overflow-hidden whitespace-nowrap">
                  Loại: {item.type}
                </div>
                <div className="mt-2 truncate overflow-hidden whitespace-nowrap">
                  {item.time}
                </div>
                <div className="mt-2 text-right font-medium cursor-pointer">
                  Chi tiết
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between gap-2 items-center">
            <h2 className="text-lg md:text-xl font-bold">
              Lịch hẹn của bạn hôm nay
            </h2>
            <span>Xem tất cả</span>
          </div>
        </div>
      </div>
    </div>
  );
}
