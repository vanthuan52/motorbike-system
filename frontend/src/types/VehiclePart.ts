export interface VehiclePart {
  id: number;
  vehicle_type_id: number | null;
  name: string;
  code: string;
  average_life: number;
  unit_price: number;
  quantity: number;
  status: boolean;
  image?: string;
}
