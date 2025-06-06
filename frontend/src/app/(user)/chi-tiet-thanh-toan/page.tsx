import { Metadata } from "next";
import CheckoutPage from "@/app/(user)/chi-tiet-thanh-toan/_components/CheckoutPage";

export const metadata: Metadata = {
  title: 'Chi tiết thanh toán',
  description: 'Trang chi tiết thanh toán',
}
export default function page() {
  return (
    <CheckoutPage />
  )
}
