import { Metadata } from "next";
import PurchaseHistoryPage from "./_components/PurchaseHistoryPage";

export const metadata: Metadata = {
  title: "Lịch sử mua hàng",
  description: "Lịch sử mua hàng hệ thống Motorbike",
};
export default function page() {
  return <PurchaseHistoryPage />;
}
