// Something here
export type ProductDetail = {
  id: string;
  name: string;
  price: number;
  image: string;
};

// ...existing code...
const FAKE_PRODUCTS: ProductDetail[] = [
  {
    id: "1",
    name: "Nhông sên dĩa DID",
    price: 600000,
    image: "/images/products/nhong-sen-dia.jpg",
  },
  {
    id: "2",
    name: "Bugi NGK",
    price: 10000000,
    image: "/images/products/bugi-ngk.jpg",
  },
  {
    id: "3",
    name: "Lốp Michelin City Grip",
    price: 1200000,
    image: "/images/products/lop-michelin.jpg",
  },
  {
    id: "4",
    name: "Dầu nhớt Motul 300V",
    price: 450000,
    image: "/images/products/nhot-motul.jpg",
  },
  {
    id: "5",
    name: "Phuộc YSS G-Series",
    price: 3200000,
    image: "/images/vehicle-parts/exhaust.png",
  },
  {
    id: "6",
    name: "Đèn LED L4X",
    price: 850000,
    image: "/images/vehicle-parts/front-light.png",
  },
  {
    id: "7",
    name: "Bình ắc quy GS",
    price: 700000,
    image: "/images/vehicle-parts/battery.png",
  },
  {
    id: "8",
    name: "Lọc gió BMC",
    price: 1100000,
    image: "/images/vehicle-parts/carburetor.png",
  },
  {
    id: "9",
    name: "Bộ tem xe thể thao",
    price: 300000,
    image: "/images/products/tem-xe.jpg",
  },
];
export async function fetchProductsByIds(
  ids: string[]
): Promise<ProductDetail[]> {
  await new Promise((res) => setTimeout(res, 200));
  return FAKE_PRODUCTS.filter((p) => ids.includes(p.id));
}
