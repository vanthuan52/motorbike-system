export interface MaintenanceManagementTypes {
  id: string;
  customer: string | null;
  phone: string;
  staff: object | null;
  maintenance_date: string;
  total_cost: number | null;
  status: string;
}
