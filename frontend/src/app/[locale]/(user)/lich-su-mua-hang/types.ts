type ShippingMethod =
  | "ghtk"
  | "ghn"
  | "viettel_post"
  | "vnpost"
  | "ahamove"
  | "grabexpress"
  | "nowship"
  | "jtexpress"
  | "ninjavan"
  | "shop_delivery"
  | "pickup_at_store";
export interface InvoiceManagement {
  id: string;
  customer_id: string;
  recipient_name?: string;
  products: ProductInvoice[];
  note?: string;
  status: "delivered" | "pending" | "cancelled";
  payment_status: "completed" | "pending" | "failed";
  payment_method: "cod" | "bank_transfer" | "momo" | "credit_card";
  shipping_method: ShippingMethod;
  shipping_fee: number;
  address: string;
  pickup_time?: string;
  subtotal: number;
  discount: number;
  total: number;
  created_at: string;
  ship_date: string;
}

export interface ProductInvoice extends Product {
  quantity: number;
}
export interface Product {
  id: string;
  sku: string;
  name: string;
  brand_id: string;
  description: string;
  price: number;
  image?: string[];
  stock: number;
  colors?: string[];
  category_id: string;
  status: "in_stock" | "out_of_stock" | "out_of_business";
  origin: string;
  slug: string;
}
