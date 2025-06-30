import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogDetailsPage from "./_components/BlogDetailsPage";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.BLOG_PAGE);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function BlogDetails() {
  return <BlogDetailsPage />;
}
