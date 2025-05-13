"use client";
import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Hourglass,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";

interface Appointment {
  id: number;
  customerName: string;
  time: string;
  status: "confirmed" | "cancelled" | "pending";
  service: string;
}

const appointments: Appointment[] = [
  {
    id: 1,
    customerName: "Trần Văn B",
    time: "2025-05-13T08:00:00",
    status: "confirmed",
    service: "Bảo dưỡng định kỳ",
  },
  {
    id: 2,
    customerName: "Nguyễn Thị C",
    time: "2025-05-13T10:30:00",
    status: "pending",
    service: "Thay nhớt & kiểm tra phanh",
  },
  {
    id: 3,
    customerName: "Lê Văn D",
    time: "2025-05-13T13:00:00",
    status: "cancelled",
    service: "Kiểm tra động cơ",
  },
];

const statusConfig = {
  confirmed: {
    label: "Đã xác nhận",
    icon: <CheckCircle size={16} />,
    color: "bg-green-100 text-green-700",
  },
  pending: {
    label: "Chờ xác nhận",
    icon: <Hourglass size={16} />,
    color: "bg-yellow-100 text-yellow-700",
  },
  cancelled: {
    label: "Đã hủy",
    icon: <XCircle size={16} />,
    color: "bg-red-100 text-red-700",
  },
};

const Schedule: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(today, "yyyy-MM-dd")
  );
  const [filteredAppointments, setFilteredAppointments] =
    useState<Appointment[]>(appointments);

  // Hàm lọc lịch hẹn theo ngày
  const filterAppointmentsByDate = (date: string) => {
    const filtered = appointments.filter((item) => {
      return format(parseISO(item.time), "yyyy-MM-dd") === date;
    });
    setFilteredAppointments(filtered);
  };

  // Xử lý khi người dùng chọn ngày
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    filterAppointmentsByDate(newDate);
  };

  return (
    <div className="p-6 bg-gradient-to-r min-h-screen">
      <div className="mb-6 flex items-center gap-3">
        <CalendarDays size={28} />
        <h2 className="text-3xl font-bold text-gray-800">Lịch hẹn</h2>
      </div>

      <div className="mb-6">
        <label
          htmlFor="appointment-date"
          className="block text-gray-700 text-sm mb-2 font-semibold"
        >
          Chọn ngày:
        </label>
        <input
          type="date"
          id="appointment-date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-3 border border-gray-300 rounded-lg w-full text-lg shadow-md hover:shadow-lg transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((item) => {
            const status = statusConfig[item.status];

            return (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.customerName}
                  </h3>
                  <p className="text-md text-gray-500">{item.service}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock size={16} className="text-blue-500" />
                  {format(parseISO(item.time), "HH:mm", { locale: vi })}
                </div>

                <div
                  className={clsx(
                    "inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full",
                    status.color
                  )}
                >
                  {status.icon}
                  {status.label}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            Không có lịch hẹn cho ngày này.
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
