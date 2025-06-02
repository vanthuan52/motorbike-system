import { Metadata } from "next";
import ProductListPage from "./_components/ProductListPage";
export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Sản phẩm của chúng tôi",
};
export default function page() {
  return (
    <div className="w-full">
      <ProductListPage />
    </div>
  );
}
