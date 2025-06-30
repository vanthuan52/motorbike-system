"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

const StaffSection = () => {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.staffSection`);

  const members = [0, 1, 2].map((i) => ({
    name: t(`members.${i}.name`),
    role: t(`members.${i}.role`),
    experience: t(`members.${i}.experience`),
    quote: t(`members.${i}.quote`),
    image: t(`members.${i}.image`),
  }));

  return (
    <section className="bg-gray-100 py-20 md:py-28">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("heading")}
        </motion.h2>

        <motion.p
          className="text-center max-w-2xl mx-auto text-gray-600 mb-16 text-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          {t("description")}
        </motion.p>

        <div className="grid gap-10 md:grid-cols-3">
          {members.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * index,
                ease: "easeOut",
              }}
            >
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover border-4 border-indigo-500"
                  sizes="128px"
                  priority={index === 0}
                />
              </div>
              <motion.h3
                className="text-xl font-semibold text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                {member.name}
              </motion.h3>
              <motion.p
                className="text-indigo-600 font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.18 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                {member.role}
              </motion.p>
              <motion.p
                className="text-gray-500 text-sm mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.21 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                {member.experience}
              </motion.p>
              <motion.blockquote
                className="italic text-gray-700 border-l-4 border-indigo-400 pl-4 text-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.24 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                “{member.quote}”
              </motion.blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
