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
    <div className="antialiased">
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
