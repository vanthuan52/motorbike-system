import { Vehicle } from "@/types/Vehicle";
import { VehicleType } from "@/types/VehicleType";
import { VehicleCompanyTypes } from "@/types/VehicleCompany";

export const mockVehicleCompanies: VehicleCompanyTypes[] = [
  { id: 1, name: "Honda", description: "Hãng Honda", status: true },
  { id: 2, name: "Yamaha", description: "Hãng Yamaha", status: true },
];

export const mockVehicleTypes: VehicleType[] = [
  { id: "vt-001", company_id: "1", name: "Xe tay ga", description: "", status: true },
  { id: "vt-002", company_id: "2", name: "Xe côn tay", description: "", status: true },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "veh-001",
    customer_id: "user-001",
    license_plate: "59A-12345",
    vehicle_model: "Air Blade",
    color: "Đỏ",
    engine_number: "ENG123456",
    chassis_number: "CHS987654",
    vehicle_type_id: "vt-001",
    image_file_name: "/images/avatar/avatar1.jpeg",
  },
  {
    id: "veh-002",
    customer_id: "user-001",
    license_plate: "59B-67890",
    vehicle_model: "Exciter 150",
    color: "Xanh",
    engine_number: "ENG654321",
    chassis_number: "CHS123456",
    vehicle_type_id: "vt-002",
    image_file_name: "/images/avatar/avatar1.jpeg",
  },
];
