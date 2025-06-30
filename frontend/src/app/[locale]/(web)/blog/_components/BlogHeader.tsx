import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function BlogHeader() {
  const t = useTranslations(TRANSLATION_FILES.BLOG_PAGE);

  return (
    <section className="relative overflow-hidden">
      <div className="container pt-10 flex flex-col gap-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {t("header.title")}
        </h1>
        <p className="text-lg md:text-xl mb-8">{t("header.description")}</p>
      </div>
    </section>
  );
}
