import { Metadata } from "next";
import Settings from "./components/Settings";

export const metadata: Metadata = {
  title: "Cài đặt | Motorbike",
  description: "Trang Cài đặt hệ thống Motorbike",
};
export default function page() {
  return <Settings />;
}
