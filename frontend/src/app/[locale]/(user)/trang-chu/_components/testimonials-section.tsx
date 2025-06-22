"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Testimonial {
  nameKey: string;
  contentKey: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    nameKey: "nguyen",
    contentKey: "nguyenContent",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    nameKey: "tran",
    contentKey: "tranContent",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    nameKey: "le",
    contentKey: "leContent",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    nameKey: "pham",
    contentKey: "phamContent",
    avatar: "https://randomuser.me/api/portraits/women/51.jpg",
  },
];

export default function TestimonialsSection() {
  const t = useTranslations("testimonialsHomepage");

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((tItem, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-14 h-14 mb-2">
                  <Image
                    src={tItem.avatar}
                    alt={t(tItem.nameKey)}
                    className="rounded-full object-cover"
                    fill
                    sizes="56px"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {t(tItem.nameKey)}
                </h3>
              </div>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.18 + 0.1 * idx,
                  ease: "easeOut",
                }}
              >
                {t(tItem.contentKey)}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
