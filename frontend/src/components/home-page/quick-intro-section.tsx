"use client";
import { APP_INFO } from "@/constant/application";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Uy tín & Chất lượng",
    description:
      "Cam kết sử dụng phụ tùng chính hãng, kỹ thuật chuẩn xác và bảo hành rõ ràng.",
  },
  {
    title: "Đội ngũ chuyên nghiệp",
    description:
      "Kỹ thuật viên nhiều năm kinh nghiệm, được đào tạo bài bản và tận tâm với khách hàng.",
  },
  {
    title: "Đặt lịch dễ dàng",
    description:
      "Chỉ vài bước đơn giản để đặt lịch trực tuyến – tiết kiệm thời gian, phục vụ nhanh chóng.",
  },
];

export default function QuickIntroSection() {
  return (
    <section className='bg-gray-50 py-16'>
      <div className='container mx-auto px-4 text-center max-w-4xl'>
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-gray-900 mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Về Trung Tâm Bảo Dưỡng {APP_INFO.NAME}
        </motion.h2>
        <motion.p
          className='text-gray-700 text-lg md:text-xl leading-relaxed mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Với hơn <strong>10 năm kinh nghiệm</strong> trong ngành bảo trì và sửa
          chữa xe máy, Trung Tâm {APP_INFO.NAME} tự hào là địa chỉ đáng tin cậy
          cho hàng ngàn khách hàng mỗi năm. Chúng tôi cung cấp các dịch vụ từ
          bảo dưỡng định kỳ, thay nhớt, sửa chữa động cơ, đến thay thế phụ tùng
          chính hãng — tất cả đều được thực hiện bởi đội ngũ kỹ thuật viên lành
          nghề.
        </motion.p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8'>
          {features.map((feature, idx) => (
            <Feature
              key={feature.title}
              title={feature.title}
              description={feature.description}
              delay={0.3 + idx * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Feature({
  title,
  description,
  delay = 0,
}: {
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      className='p-6 bg-white shadow-md rounded-lg text-left  transition'
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      viewport={{ amount: 0.2 }}
      transition={{
        opacity: { duration: 0.5, delay, ease: "easeOut" },
        y: { duration: 0.5, delay, ease: "easeOut" },
      }}
    >
      <h3 className='text-xl font-semibold text-gray-800 mb-2'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </motion.div>
  );
}
