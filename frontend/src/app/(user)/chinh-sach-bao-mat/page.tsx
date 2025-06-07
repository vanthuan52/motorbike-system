
import { Metadata } from "next";
import PrivacyPolicy from "./_components/PrivacyPolicy";
import UserLayout from "@/layout/UserLayout";
export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật hệ thống Motorbike',
}
export default function PrivacyPolicyLayout() {
  return (
    <UserLayout>
      <PrivacyPolicy />
    </UserLayout>
  );
}
