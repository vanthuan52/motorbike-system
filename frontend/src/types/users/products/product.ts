export interface Product {
  id: string;
  sku: string;
  name: string;
  brand_id: string;
  description: string;
  price: number;
  image: string[];
  stock: number;
  colors: string[];
  category_id: string;
  category_slug: string;
  status: "in_stock" | "out_of_stock" | "out_of_business";
  origin: string;
  slug: string;
}
