import { Montserrat } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ToastProvider from "@/features/notification/components/toast-provider";
import ReduxProvider from "@/components/ReduxProvider";
import AppProvider from "./provider";
import AppInitializer from "./app-initializer";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import "@/styles/globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <ReactQueryProvider>
          <AntdRegistry>
            <ReduxProvider>
              <AppInitializer />
              <NextIntlClientProvider locale={locale}>
                <AppProvider>{children}</AppProvider>
              </NextIntlClientProvider>
              <ToastProvider />
            </ReduxProvider>
          </AntdRegistry>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
