export interface Product {
  id: string;
  sku: string;
  name: string;
  brandId: string;
  description: string;
  price: number;
  image: string[];
  stock: number;
  colors: string[];
  partTypeId: string;
  partTypeSlug: string;
  status: "in_stock" | "out_of_stock" | "out_of_business";
  origin: string;
  slug: string;
  quantity?: number;
}
