export interface MaintenanceHistoryCustomer {
  id: number;
  vehicle_name: string;
  license_plate: string;
  staff: { id: number; name: string } | null;
  date: string;
  time_slot: string;  
  status: string;             
  total_cost: number;          
}
