import { MaintenanceManagementTypes } from "@/types/maintenance";

export const mockDataTableMaintenance: MaintenanceManagementTypes[] = [
  {
    id: "m-1",
    customer: "Nguyễn Văn A",
    phone: "0123456789",
    staff: {
      id: "e-1",
      name: "Nguyễn Văn B",
      phone: "0987654321",
      email: "b@c.com",
    },
    maintenance_date: "2023-10-01",
    total_cost: 1000000,
    status: "Đã hoàn thành",
  },

  {
    id: "m-2",
    customer: "Nguyễn Văn A",
    phone: "0123456789",
    staff: {
      id: "e-2",
      name: "Trần Thị D",
      phone: "0987654321",
      email: "d@e.com",
    },
    maintenance_date: "2023-10-02",
    total_cost: 2000000,
    status: "Đang chờ",
  },

  {
    id: "m-3",
    customer: "Nguyễn Văn A",
    phone: "0123456789",
    staff: {
      id: "e-3",
      name: "Nguyễn Văn F",
      phone: "0987654321",
      email: "f@g.com",
    },
    maintenance_date: "2023-10-03",
    total_cost: 3000000,
    status: "Đã hoàn thành",
  },

  {
    id: "m-4",
    customer: "Nguyễn Văn A",

    phone: "0123456789",
    staff: {
      id: "e-4",
      name: "Nguyễn Văn H",
      phone: "0987654321",
      email: "h@i.com",
    },
    maintenance_date: "2023-10-04",
    total_cost: 4000000,
    status: "Đang chờ",
  },
  {
    id: "m-5",
    customer: "Nguyễn Văn A",

    phone: "0123456789",
    staff: {
      id: "e-5",
      name: "Nguyễn Văn J",
      phone: "0987654321",
      email: "j@k.com",
    },
    maintenance_date: "2023-10-05",
    total_cost: 5000000,
    status: "Đã hoàn thành",
  },
];
