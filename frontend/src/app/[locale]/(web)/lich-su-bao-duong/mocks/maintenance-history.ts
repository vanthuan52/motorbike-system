import { MaintenanceHistoryCustomer } from "../types/types";

export const maintenanceHistoryCustomers: MaintenanceHistoryCustomer[] = [
  {
    id: 1,
    vehicle_name: "Honda Vision",
    license_plate: "29A1-123.45",
    staff: { id: 1, name: "Nguyễn Văn A" },
    date: "2025-03-15",
    time_slot: "08:00 - 10:00",
    status: "Hoàn thành",
    total_cost: 1500000,
 
  },
  {
    id: 2,
    vehicle_name: "Yamaha Exciter",
    license_plate: "30B2-456.78",
    staff: { id: 2, name: "Trần Thị B" },
    date: "2025-04-10",
    time_slot: "10:30 - 12:00",
    status: "Chưa hoàn thành",
    total_cost: 1200000,
  },
  {
    id: 3,
    vehicle_name: "Suzuki Raider",
    license_plate: "31C3-789.01",
    staff: { id: 3, name: "Lê Văn C" },
    date: "2025-05-01",
    time_slot: "13:00 - 15:00",
    status: "Chờ xử lý",
    total_cost: 900000,
  },
  {
    id: 4,
    vehicle_name: "Piaggio Liberty",
    license_plate: "32D4-234.56",
    staff: null,
    date: "2025-05-12",
    time_slot: "09:00 - 11:00",
    status: "Chờ xử lý",
    total_cost: 0,
  },
  {
    id: 5,
    vehicle_name: "SYM Attila",
    license_plate: "33E5-345.67",
    staff: { id: 4, name: "Phạm Thị D" },
    date: "2025-05-20",
    time_slot: "14:00 - 16:00",
    status: "Hoàn thành",
    total_cost: 1100000,
  }
];
