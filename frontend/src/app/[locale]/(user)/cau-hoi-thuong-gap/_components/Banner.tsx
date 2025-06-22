import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Banner() {
  const t = useTranslations("faqPage");

  return (
    <div className="relative w-full h-64 md:h-96">
      <Image
        src="/images/faqs/banner-0.jpg"
        alt="FAQ banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-2xl">
          {t("description")}
        </p>
      </div>
    </div>
  );
}
