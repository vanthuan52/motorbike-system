export interface VehicleCompanyTypes {
  id: string;
  name: string;
  description: string;
  status: boolean;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}