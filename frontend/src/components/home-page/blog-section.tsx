"use client";

import { motion } from "framer-motion";
import { CustomLink } from "../CustomerLink/CustomLink";

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "5 dấu hiệu xe máy cần bảo dưỡng gấp",
    excerpt:
      "Bạn có biết rằng việc xe bị ì máy, hao xăng, hay khó khởi động là những dấu hiệu xe đang “kêu cứu”?",
    image: "/images/blog/maintainance-motorbike.jpg",
    slug: "/blog/5-dau-hieu-xe-can-bao-duong",
  },
  {
    title: "Lịch thay nhớt lý tưởng cho xe tay ga",
    excerpt:
      "Thay nhớt đúng định kỳ giúp động cơ vận hành mượt mà và kéo dài tuổi thọ xe của bạn.",
    image: "/images/blog/oil-change.jpg",
    slug: "/blog/lich-thay-nhot-xe-tay-ga",
  },
  {
    title: "Tự kiểm tra lốp xe tại nhà chỉ trong 5 phút",
    excerpt:
      "Hướng dẫn nhanh giúp bạn kiểm tra độ mòn và áp suất lốp mà không cần đến cửa hàng.",
    image: "/images/blog/check-tires.jpg",
    slug: "/blog/kiem-tra-lop-xe-tai-nha",
  },
];

export default function BlogSection() {
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
          Kiến thức bảo dưỡng hữu ích
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
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
                  Xem thêm →
                </CustomLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
