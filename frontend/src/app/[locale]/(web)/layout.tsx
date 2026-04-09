import type { Metadata } from "next";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { FloatingAction } from "@/components/ui/floating-action";

export const metadata: Metadata = {
  title: "Ant Motor",
  description: "Ant Motor",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-bg">
      <Header />
      <div className="pt-[100px]">{children}</div>
      <Footer />
      <FloatingAction />
    </main>
  );
}
