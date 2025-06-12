export interface Category {
  id: string;
  vehicle_company_id: string | null;
  name: string;
  description: string;
  status: boolean;
  slug: string;
  images?: string[];
}
export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}
