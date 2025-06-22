"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CustomLink } from "../../../../../components/CustomerLink/CustomLink";

export default function BlogSection() {
  const t = useTranslations("BlogSection");
  const posts = t.raw("posts") as {
    title: string;
    excerpt: string;
    image: string;
    slug: string;
  }[];

  return (
    <section className="bg-gray-100 py-20">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12"
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
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300"
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
                  className="text-xl font-semibold text-gray-900 mb-2"
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
                  className="text-sm text-gray-600 mb-4"
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
                <CustomLink
                  href={post.slug}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {t("readMore")}
                </CustomLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
