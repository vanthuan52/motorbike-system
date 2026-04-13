import { useTranslations } from "next-intl";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

export const ContactCTA = () => {
  const t = useTranslations(`${TRANSLATION_FILES.FAQ_PAGE}.contactCTA`);

  return (
    <div className="mt-16 text-center bg-surface-alt rounded-[var(--radius-xl)] p-8">
      <h3 className="text-xl font-semibold text-text-primary mb-3">{t("title")}</h3>
      <p className="text-text-secondary mb-6">{t("description")}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/vi/contact">
          <Button size="lg" className="w-full sm:w-auto px-8 rounded-xl">
            {t("contactNow")}
          </Button>
        </Link>
        <Button size="lg" variant="outline" asChild className="w-full sm:w-auto px-8 rounded-xl border-2 border-primary-700 text-primary-700 hover:bg-primary-50">
          <a href="tel:0123456789">
            {t("callHotline")}
          </a>
        </Button>
      </div>
    </div>
  );
};
