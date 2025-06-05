"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const awards = [
  {
    title: "Chứng nhận Dịch vụ Xuất sắc 2022",
    description:
      "Được trao bởi Hiệp hội Kỹ thuật Việt Nam vì những đóng góp nổi bật trong lĩnh vực bảo dưỡng xe.",
    image: "/images/about/award-1.jpg",
  },
  {
    title: "Top 10 Trung tâm sửa chữa uy tín",
    description: "Bình chọn bởi cộng đồng người dùng AutoViet năm 2023.",
    image: "/images/about/award-2.jpg",
  },
  {
    title: "Giải thưởng Dịch vụ Khách hàng tốt nhất",
    description:
      "Được vinh danh tại Triển lãm Công nghiệp Xe máy toàn quốc 2022.",
    image: "/images/about/award-3.jpg",
  },
];

const AwardsSection = () => {
  return (
    <section className='bg-gray-50 py-20 md:py-28'>
      <div className='container'>
        <h2 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12'>
          Chứng Nhận & Giải Thưởng
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {awards.map((item, index) => (
            <motion.div
              key={index}
              className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform hover:-translate-y-1'
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * index,
                ease: "easeOut",
              }}
            >
              <div className='relative w-full h-48'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className='object-cover'
                  sizes='100vw'
                  priority={index === 0}
                />
              </div>
              <div className='p-5'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  {item.title}
                </h3>
                <p className='text-sm text-gray-600'>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
