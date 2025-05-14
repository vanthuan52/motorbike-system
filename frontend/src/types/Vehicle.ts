export interface Vehicle {
  id: string;
  customer_id: string;
  license_plate: string;
  vehicle_model?: string | null;
  color?: string | null;
  engine_number?: string | null;
  chassis_number?: string | null;
  vehicle_type_id: string;
  image_file_name?: string | null;
}
