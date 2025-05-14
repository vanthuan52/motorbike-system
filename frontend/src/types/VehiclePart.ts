export interface VehiclePart {
  id: string;
  vehicle_type_id: string | null;
  name: string;
  code: string;
  average_life: number;
  unit_price: number;
  quantity: number;
  status: boolean;
  image?: string;
}
