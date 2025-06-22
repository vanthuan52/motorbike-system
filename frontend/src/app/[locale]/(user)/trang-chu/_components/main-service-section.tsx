"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface Service {
  image: string;
  title: string;
  description: string;
}

const servicesKeys = ["repair", "oilChange", "wash", "replacement"] as const;

export default function MainServicesSection() {
  const t = useTranslations("servicesHomepage");

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesKeys.map((key, idx) => (
            <motion.div
              key={key}
              className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                transition: { duration: 0.22, ease: "easeOut" },
              }}
            >
              <motion.div
                className="relative h-60 w-full rounded-t-xl overflow-hidden"
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * idx,
                  ease: "easeOut",
                }}
              >
                <Image
                  src={t(`${key}.image`)}
                  alt={t(`${key}.title`)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  unoptimized
                />
              </motion.div>

              <div className="p-5 text-center">
                <motion.h3
                  className="text-lg font-semibold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + 0.1 * idx,
                    ease: "easeOut",
                  }}
                >
                  {t(`${key}.title`)}
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.18 + 0.1 * idx,
                    ease: "easeOut",
                  }}
                >
                  {t(`${key}.description`)}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center py-5 mt-5">
          <button className="border border-gray-800 text-gray-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition cursor-pointer">
            {t("viewAll")}
          </button>
        </div>
      </div>
    </section>
  );
}
