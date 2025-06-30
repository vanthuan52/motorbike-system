"use client";

import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

const SocialCommunitySection = () => {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.socialCommunity`);

  const activities = [0, 1].map((i) => ({
    title: t(`activities.${i}.title`),
    description: t(`activities.${i}.description`),
  }));

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        {/* Social icons */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
          {t("followUs")}
        </h2>
        <div className="flex justify-center gap-6 mb-16">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-3xl hover:scale-110 transition-transform"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-pink-500 text-3xl hover:scale-110 transition-transform"
          >
            <FaInstagram />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="text-red-600 text-3xl hover:scale-110 transition-transform"
          >
            <FaYoutube />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="text-black text-3xl hover:scale-110 transition-transform"
          >
            <FaTiktok />
          </a>
        </div>

        {/* Community activities */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          {t("communityTitle")}
        </h2>

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
              className="rounded-2xl shadow-md overflow-hidden bg-gray-50 hover:shadow-xl transition-shadow"
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
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialCommunitySection;
