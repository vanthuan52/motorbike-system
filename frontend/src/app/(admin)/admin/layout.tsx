// app/(admin)/layout.tsx
import AdminLayout from "@/layout/AdminLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Motorbike",
  description: "Admin Dashboard for Motorbike",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased">
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
