import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogDetailsPage from "./_components/BlogDetailsPage";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaBlogpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function BlogDetails() {
  return <BlogDetailsPage />;
}
