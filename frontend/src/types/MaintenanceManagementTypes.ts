export interface MaintenanceManagementTypes {
  id: number;
  customer: object | null;
  phone: number;
  staff: object | null;
  maintenance_date: string;
  total_cost: number | null;
  status: string;
}
