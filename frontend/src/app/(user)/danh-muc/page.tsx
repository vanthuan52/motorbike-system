import { Metadata } from "next";
import CategoryPage from "./_components/CategoryPage";

export const metadata: Metadata = {
  title: "Danh mục",
  description: "Trang hiển thị danh sách các danh mục phụ tùng xe máy",
};
export default function Page() {
  return (
    <div className="w-full">
      <CategoryPage />
    </div>
  );
}
