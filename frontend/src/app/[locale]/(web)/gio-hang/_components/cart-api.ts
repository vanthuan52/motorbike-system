import { mockProducts } from "@/data/Products";
import { Product } from "@/types/users/products/product";

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  await new Promise((res) => setTimeout(res, 200));
  return mockProducts.filter((p) => ids.includes(p.id));
}
