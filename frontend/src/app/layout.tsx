//app/layout.tsx

import type { Metadata } from "next";
import { Poppins, Nosifer } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import ToastProvider from "@/components/Toast/ToastProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nosifer = Nosifer({
  variable: "--font-nosifer",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Motorbike",
  description: "Motorbike",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <html lang="en">
        <body className={`${poppins.variable} ${nosifer.variable} antialiased`}>
          {children}
        </body>
      </html>
      <ToastProvider />
    </AntdRegistry>
  );
}
