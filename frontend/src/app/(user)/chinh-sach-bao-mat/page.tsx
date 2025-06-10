import { Metadata } from "next";
import PrivacyPolicy from "./_components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách bảo mật hệ thống Motorbike",
};
export default function PrivacyPolicyLayout() {
  return <PrivacyPolicy />;
}
