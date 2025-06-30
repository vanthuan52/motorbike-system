export interface MaintenanceSchedule {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  vehicle_type: string;
  vehicle_brand: string;
  service_type: string;
  vehicle_number: string;
  date: string; 
  time: string; 
  address: string;
  note: string;
  status: "confirmed" | "cancelled" | "pending";
}
