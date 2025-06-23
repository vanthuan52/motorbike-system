import { Montserrat } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import ToastProvider from "@/features/notification/components/toast-provider";
import { HandleProgressOnComplete } from "@/lib/nprogress/HandleOnProgressComplete";
import ReduxProvider from "@/components/ReduxProvider";
import GlobalLoading from "@/components/ui/global-loading";
import "@/styles/globals.css";
import AppInitializer from "./app-initializer";
// import NotFound from "./not-found";
import { routing } from "@/i18n/routing";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { notFound } from "next/navigation";
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
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} antialiased`} lang={locale}>
        <ReactQueryProvider>
          <AntdRegistry>
            <ReduxProvider>
              <AppInitializer />
              <GlobalLoading />
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
              <ToastProvider />
              <HandleProgressOnComplete />
            </ReduxProvider>
          </AntdRegistry>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
