import { mockProducts } from "@/data/Products";

export async function fetchProducts({
  status,
  price,
  categories,
  search,
  sort,
  page,
  pageSize,
}: {
  status: string[];
  price: [number, number];
  categories: string[];
  search: string;
  sort: string;
  page: number;
  pageSize: number;
}) {
  let filtered = mockProducts.filter((p) => {
    const [min, max] = price;
    const matchStatus = status.length === 0 || status.includes(p.status);
    const matchPrice = p.price >= min && p.price <= max;
    const matchCategory =
      categories.length === 0 ||
      categories
        .map((c) => c.toLowerCase())
        .includes((p.category_slug || "").toLowerCase());
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPrice && matchCategory && matchSearch;
  });

  if (sort === "price-asc")
    filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc")
    filtered = filtered.sort((a, b) => b.price - a.price);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  await new Promise((res) => setTimeout(res, 300));
  return { products: paged, total };
}
