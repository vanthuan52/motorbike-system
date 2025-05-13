// src/pages/technician/maintenance.tsx

"use client";
import React, { useState } from "react";
import { Wrench, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const vehicles = [
  {
    id: 1,
    name: "Honda CBR 600",
    status: "Cần bảo dưỡng",
    lastServiceDate: "2025-03-15",
  },
  {
    id: 2,
    name: "Yamaha R1",
    status: "Đã bảo dưỡng",
    lastServiceDate: "2025-02-20",
  },
  {
    id: 3,
    name: "Kawasaki Ninja 400",
    status: "Cần bảo dưỡng",
    lastServiceDate: "2025-05-01",
  },
];

const MaintenanancePage = () => {
  const [maintenanceStatus, setMaintenanceStatus] = useState(vehicles);

  const handleUpdateStatus = (id: number) => {
    setMaintenanceStatus((prevStatus) =>
      prevStatus.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, status: "Đã bảo dưỡng" } : vehicle
      )
    );
  };

  return (
    <div className="p-6 bg-gradient-to-r  min-h-screen">
      <div className="mt-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Danh sách xe cần bảo dưỡng
        </h2>
        <div className="space-y-6">
          {maintenanceStatus.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Ngày bảo dưỡng gần nhất: {vehicle.lastServiceDate}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Trạng thái:{" "}
                    <span
                      className={`${
                        vehicle.status === "Cần bảo dưỡng"
                          ? "text-yellow-600"
                          : vehicle.status === "Đã bảo dưỡng"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {vehicle.status}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <Link
                    href={`/technician/maintenance/${vehicle.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-200 ease-in-out"
                  >
                    <Wrench size={22} className="mr-2" />
                    Chi tiết bảo dưỡng
                  </Link>

                  {vehicle.status === "Cần bảo dưỡng" ? (
                    <button
                      onClick={() => handleUpdateStatus(vehicle.id)}
                      className="flex items-center text-green-600 hover:text-green-800 transition-all duration-200 ease-in-out"
                    >
                      <CheckCircle size={22} className="mr-2" />
                      Đã bảo dưỡng
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(vehicle.id)}
                      className="flex items-center text-red-600 hover:text-red-800 transition-all duration-200 ease-in-out"
                    >
                      <XCircle size={22} className="mr-2" />
                      Đã hoàn tất bảo dưỡng
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanancePage;
