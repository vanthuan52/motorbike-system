export interface Appointment {
  id: number;
  name: string;
  last_service_date: string;
  status: string;
  employee_id: string | null;
  customer_id: string;
  vehicle_id: string;
  vehicle_condition?: string | null;
  services?: string[] | null;
  parts?: string[] | null;
}
