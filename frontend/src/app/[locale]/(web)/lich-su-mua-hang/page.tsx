import { Metadata } from "next";
import PurchaseHistoryPage from "../../../../features/order/components/purchase-history-page";

export const metadata: Metadata = {
  title: "Lịch sử mua hàng",
  description: "Lịch sử mua hàng hệ thống Motorbike",
};
export default function Page() {
  return <PurchaseHistoryPage />;
}
