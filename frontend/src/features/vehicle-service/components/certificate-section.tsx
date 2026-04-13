"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { TRANSLATION_FILES } from "@/lib/i18n";

interface Certification {
  nameKey: string;
  descKey: string;
  image: string;
}

interface Testimonial {
  nameKey: string;
  commentKey: string;
  avatar: string;
}

const certifications: Certification[] = [
  {
    nameKey: "aseTitle",
    descKey: "aseDesc",
    image: "/images/certificates/ase-certificate.jpg",
  },
  {
    nameKey: "isoTitle",
    descKey: "isoDesc",
    image: "/images/certificates/iso-9001.png",
  },
];

const testimonials: Testimonial[] = [
  {
    nameKey: "nguyen",
    commentKey: "nguyenComment",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
  },
  {
    nameKey: "tran",
    commentKey: "tranComment",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

export default function CertificationAndTestimonials() {
  const t = useTranslations(
    `${TRANSLATION_FILES.SERVICE_PAGE}.testimonialsSection`
  );

  return (
    <section className="bg-surface-alt py-20 md:py-28">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-6 bg-surface p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={cert.image}
                  alt={t(cert.nameKey)}
                  fill
                  className="object-contain rounded"
                  sizes="64px"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-text-primary">
                  {`${t(cert.nameKey)}`}
                </h3>
                <p className="text-text-secondary text-sm">{`${t(cert.descKey)}`}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.h3
          className="text-2xl font-semibold text-center text-text-primary mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {t("subTitle")}
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((testi, idx) => (
            <motion.div
              key={idx}
              className="bg-surface p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] flex flex-col gap-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                  <Image
                    src={testi.avatar}
                    alt={t(testi.nameKey)}
                    fill
                    className="rounded-full object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {`${t(testi.nameKey)}`}
                  </p>
                  <div className="flex text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-text-secondary italic flex gap-2 items-start">
                <Quote size={18} className="text-primary-400 mt-1" />
                <p>{`${t(testi.commentKey)}`}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
