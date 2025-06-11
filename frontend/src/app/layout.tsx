import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import ToastProvider from "@/features/notification/components/toast-provider";
import { HandleProgressOnComplete } from "@/lib/nprogress/HandleOnProgressComplete";
import { PageProps } from "@/types/application";
import ReduxProvider from "@/components/ReduxProvider";
import AppInitializer from "./app-initializer";
import GlobalLoading from "@/components/ui/global-loading";
import "@/styles/globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata | null> {
  try {
    return {
      title: "Motorbike",
      description: "Description",
      keywords: "abc",
      metadataBase: null,
      openGraph: null,
    };
  } catch (error: any) {
    return notFound();
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <html lang="en">
        <body className={`${montserrat.variable} antialiased`}>
          <ReduxProvider>
            <AppInitializer />
            <GlobalLoading />
            {children}
          </ReduxProvider>
          <ToastProvider />
          <HandleProgressOnComplete />
        </body>
      </html>
    </AntdRegistry>
  );
}
