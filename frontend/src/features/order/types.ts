type ShippingMethod =
  | "ghtk"
  | "ghn"
  | "viettelPost"
  | "vnpost"
  | "ahamove"
  | "grabexpress"
  | "nowship"
  | "jtexpress"
  | "ninjavan"
  | "shopDelivery"
  | "pickupAtStore";

export interface InvoiceManagement {
  id: string;
  customerId: string;
  recipient_name?: string;
  products: ProductInvoice[];
  note?: string;
  status: "delivered" | "pending" | "cancelled";
  paymentStatus: "completed" | "pending" | "failed";
  paymentMethod: "cod" | "bank_transfer" | "momo" | "credit_card";
  shippingMethod: ShippingMethod;
  shippingFee: number;
  address: string;
  pickupTime?: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  shipDate: string;
}

export interface ProductInvoice extends Product {
  quantity: number;
}
export interface Product {
  id: string;
  sku: string;
  name: string;
  brandId: string;
  description: string;
  price: number;
  image?: string[];
  stock: number;
  colors?: string[];
  partTypeId: string;
  status: "in_stock" | "out_of_stock" | "out_of_business";
  origin: string;
  slug: string;
}
