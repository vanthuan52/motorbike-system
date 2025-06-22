import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogPage from "./_components/BlogPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaBlogpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function page() {
  return <BlogPage />;
}
