"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { toast } from "react-toastify";
import {
  mockDataTableManageEmployees,
  mockDataTableManageCustomers,
  vehicleData,
} from "@/data/TableData";
import { Appointment } from "@/types/Appointment";
import { pendingAppointments } from "@/data/PendingAppointments";
import MaintenanceWaitingCard from "./MaintenanceWaitingCard";
import MaintenanceMyOrderCard from "./MaintenanceMyOrderCard";
import MaintenanceOrderDetailModal from "./MaintenanceOrderDetailModal";
import { Vehicle } from "@/types/Vehicle";
import { CustomerType } from "@/types/Customers";

export default function TechnicianMaintenancePage() {
  const [waitingList, setWaitingList] =
    useState<Appointment[]>(pendingAppointments);
  const [myOrders, setMyOrders] = useState<Appointment[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Appointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>({
    id: "",
    customer_id: "",
    license_plate: "",
    vehicle_model: "",
    color: "",
    engine_number: "",
    chassis_number: "",
    vehicle_type_id: "",
    image_file_name: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType>({
    id: "",
    first_name: null,
    last_name: null,
    phone: null,
    email: null,
    password: null,
    type: null,
    status: null,
    created_at: null,
    updated_at: null,
  });
  const getCustomerName = (id: string) => {
    const customer = mockDataTableManageCustomers.find((cus) => cus.id === id);
    return customer
      ? `${customer.first_name} ${customer.last_name}`
      : "Chưa rõ";
  };

  const getEmployeeName = (id: string | null) => {
    if (!id) return "Chưa có";
    const emp = mockDataTableManageEmployees.find((e) => e.id === id);
    return emp ? `${emp.first_name} ${emp.last_name}` : "Không xác định";
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "prepare":
        return "Đang chuẩn bị";
      case "wait_for_execution":
        return "Chờ thực hiện";
      case "in_progress":
        return "Đang xử lý";
      case "is_done":
        return "Đã hoàn thành";
      case "cancelled":
        return "Huỷ";
      default:
        return "Không xác định";
    }
  };
  const getVehicle = (id: string) => {
    const vehicle = vehicleData.find((v) => v.id === id);
    return vehicle;
  };
  const hasActiveOrder = myOrders.some(
    (order) => order.status !== "done" && order.status !== "cancelled"
  );
  const handleAcceptAppointment = (id: number) => {
    if (hasActiveOrder) {
      toast.warning(
        "Bạn chỉ được nhận tối đa 1 lịch. Hãy hoàn thành lịch hiện tại trước!"
      );
      return;
    }
    const selected = waitingList.find((item) => item.id === id);
    const selectedCustomer = mockDataTableManageCustomers.find(
      (cus) => cus.id === selected?.customer_id
    );

    const selectedVehicle = vehicleData.find(
      (v) => v.id === selected?.vehicle_id
    );
    setSelectedCustomer(selectedCustomer!);
    setSelectedVehicle(selectedVehicle!);

    if (!selected || selected.employee_id) return;

    const newOrder = {
      ...selected,
      status: "prepare",
      employee_id: "e-1",
    };
    setTimeout(() => setLoading(false), 500);
    toast.success(`Đã nhận lịch bảo dưỡng xe ${selected.name}`);
    setMyOrders((prev) => [newOrder, ...prev]);
    setWaitingList((prev) => prev.filter((item) => item.id !== id));
  };
  const handleStatusChange = (id: number, newStatus: string) => {
    setMyOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    toast.success("Cập nhật trạng thái thành công!");
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
        Lịch bảo dưỡng
      </h1>

      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          Lịch bảo dưỡng chưa được nhận
        </h2>
        {waitingList.length === 0 ? (
          <p className="text-gray-500 italic">Không có lịch chờ nhận.</p>
        ) : (
          <Swiper
            spaceBetween={16}
            slidesPerView={"auto"}
            className="!p-2 cursor-grab"
          >
            {waitingList.map((appointment) => (
              <SwiperSlide key={appointment.id} style={{ width: "300px" }}>
                <MaintenanceWaitingCard
                  appointment={appointment}
                  getCustomerName={getCustomerName}
                  getEmployeeName={getEmployeeName}
                  getVehicle={getVehicle}
                  getStatus={getStatus}
                  loading={loading}
                  onAccept={handleAcceptAppointment}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          Đơn bảo dưỡng do tôi phụ trách
        </h2>
        {myOrders.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có đơn nào được nhận.</p>
        ) : (
          <Swiper
            spaceBetween={16}
            slidesPerView={"auto"}
            className="!p-2 cursor-grab"
          >
            {myOrders.map((order) => (
              <SwiperSlide key={order.id} style={{ width: "300px" }}>
                <MaintenanceMyOrderCard
                  order={order}
                  getCustomerName={getCustomerName}
                  getEmployeeName={getEmployeeName}
                  handleStatusChange={handleStatusChange}
                  onClick={() => {
                    setSelectedOrder(order);
                    setModalOpen(true);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>
      <MaintenanceOrderDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        vehicle={selectedVehicle}
        customer={selectedCustomer}
        onSaveCondition={(condition) => {
          toast.success("Lưu đánh giá thành công!");
        }}
        onSaveServices={(services, parts) => {
          toast.success("Lưu hạng mục thành công!");
        }}
      />
    </div>
  );
}
