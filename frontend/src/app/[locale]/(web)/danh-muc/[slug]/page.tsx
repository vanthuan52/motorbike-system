import { Metadata } from "next";
import PartTypeDetailsPage from "./_components/part-type-detail-page";

export const metadata: Metadata = {
  title: "Chi tiết danh mục",
  description: "Trang hiển thị danh sách các danh mục phụ tùng xe máy",
};
export default function Page() {
  return <PartTypeDetailsPage />;
}
