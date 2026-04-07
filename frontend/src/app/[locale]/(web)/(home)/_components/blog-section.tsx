"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";

export default function BlogSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.blogSection`);
  const posts = t.raw("posts") as {
    title: string;
    excerpt: string;
    image: string;
    slug: string;
  }[];

  return (
    <section className="bg-surface-alt py-20">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-surface rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg-hover)] transition-all duration-300"
            >
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
                initial={{ scale: 0.92, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.3 }}
                whileHover={{ scale: 1.05 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * index,
                  ease: "easeOut",
                }}
              />
              <div className="p-6">
                <motion.h3
                  className="text-xl font-semibold text-text-primary mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.14 + 0.08 * index,
                    ease: "easeOut",
                  }}
                >
                  {post.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-text-secondary mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.18 + 0.08 * index,
                    ease: "easeOut",
                  }}
                >
                  {post.excerpt}
                </motion.p>
                <Link
                  href={post.slug}
                  className="text-primary-700 font-medium hover:text-primary-500 hover:underline transition-colors duration-150"
                >
                  {t("readMore")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
