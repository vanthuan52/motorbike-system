export interface UserType {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  password: string | null;
  type: "CUSTOMER" | "EMPLOYEE" | null;
  status: "ACTIVE" | "INACTIVE" | null;
  photo?: string | null;
  gender?: "MALE" | "FEMALE" | null;
  dob?: string | null;
  address?: string | null;
  ward?: string | null;
  district?: string | null;
  city?: string | null;
  created_at: string | null;
  updated_at: string | null;
  ref_id?: string | null;
}
