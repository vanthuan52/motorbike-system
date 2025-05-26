import { Metadata } from "next";

import Profiles from "./components/Profiles";

export const metadata: Metadata = {
  title: "Cài đặt | Motorbike",
  description: "Trang Cài đặt hệ thống Motorbike",
};
export default function page() {
  return <Profiles />;
}
