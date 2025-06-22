import { useTranslations } from "next-intl";

export default function BlogHeader() {
  const t = useTranslations("blogPage.header");

  return (
    <section className="relative overflow-hidden">
      <div className="container pt-10 flex flex-col gap-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-lg md:text-xl mb-8">{t("description")}</p>
      </div>
    </section>
  );
}
