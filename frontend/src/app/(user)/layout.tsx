//app/(user)/layout.tsx
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
export const metadata: Metadata = {
  title: "Motorbike",
  description: "Motorbike",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased bg-[#F8F8F8]">
      <Header />
      <main className="pt-[100px]">{children}</main>
      <Footer />
    </div>
  );
}
