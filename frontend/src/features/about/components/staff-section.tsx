"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

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
    <section className="bg-surface-alt py-20 md:py-28">
      <div className="container">
        <SectionHeading 
          title={t("heading")} 
          subtitle={t("description")} 
          className="mb-16" 
        />

        <div className="grid gap-10 md:grid-cols-3">
          {members.map((member, index) => (
            <motion.div
              key={index}
              className="bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg-hover)] transition-all duration-300 p-6 text-center"
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
                  className="rounded-full object-cover border-4 border-primary-400"
                  sizes="128px"
                  priority={index === 0}
                />
              </div>
              <motion.h3
                className="text-xl font-semibold text-text-primary"
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
                className="text-primary-700 font-medium"
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
                className="text-text-muted text-sm mb-4"
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
                className="italic text-text-secondary border-l-4 border-primary-300 pl-4 text-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.24 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                "{member.quote}"
              </motion.blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
