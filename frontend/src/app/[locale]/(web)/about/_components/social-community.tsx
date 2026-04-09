"use client";

import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

const SocialCommunitySection = () => {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.socialCommunity`);

  const activities = [0, 1].map((i) => ({
    title: t(`activities.${i}.title`),
    description: t(`activities.${i}.description`),
  }));

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container">
        {/* Social icons */}
        <SectionHeading title={t("followUs")} className="mb-8" />
        <div className="flex justify-center gap-6 mb-16">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary-700 text-3xl hover:scale-110 hover:text-primary-500 transition-all duration-200"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-accent text-3xl hover:scale-110 transition-all duration-200"
          >
            <FaInstagram />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="text-error text-3xl hover:scale-110 transition-all duration-200"
          >
            <FaYoutube />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="text-text-primary text-3xl hover:scale-110 transition-all duration-200"
          >
            <FaTiktok />
          </a>
        </div>

        {/* Community activities */}
        <SectionHeading title={t("communityTitle")} className="mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {activities.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.2,
                ease: "easeOut",
              }}
              viewport={{ amount: 0.2 }}
              className="rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] overflow-hidden bg-surface-alt hover:shadow-[var(--shadow-xl-hover)] transition-all duration-200"
            >
              <div className="relative w-full h-48">
                <Image
                  src={`/images/about/community-${idx + 1}.jpg`}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={idx === 0}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2 text-text-primary">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialCommunitySection;
