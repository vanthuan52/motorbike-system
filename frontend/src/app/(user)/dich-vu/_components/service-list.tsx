"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const services = [
  {
    title: "Thay nhớt",
    description: "Giúp động cơ vận hành êm ái, kéo dài tuổi thọ.",
    image: "/images/services/oil-change.png",
    price: "Từ 90.000đ",
  },
  {
    title: "Bảo dưỡng tổng thể",
    description: "Kiểm tra toàn bộ xe, phát hiện lỗi sớm, đảm bảo an toàn.",
    image: "/images/services/full-maintenance.jpg",
    price: "Từ 299.000đ",
  },
  {
    title: "Thay bugi, lọc gió",
    description: "Đảm bảo đánh lửa mạnh, tiết kiệm nhiên liệu.",
    image: "/images/services/spark-air.jpg",
    price: "Từ 120.000đ",
  },
  {
    title: "Sửa phanh, thay má phanh",
    description: "An toàn khi di chuyển, kiểm tra hệ thống phanh.",
    image: "/images/services/brake-repair.jpg",
    price: "Từ 150.000đ",
  },
  {
    title: "Sửa điện, đèn, còi",
    description: "Khắc phục các lỗi điện, thay thế phụ tùng nhanh chóng.",
    image: "/images/services/electrical.jpg",
    price: "Tùy theo hạng mục",
  },
];

export default function ServiceList() {
  return (
    <section className='py-16 bg-white text-gray-800'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl md:text-4xl font-bold mb-10 text-center'>
          Dịch vụ nổi bật
        </h2>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service, index) => (
            <ZoomInCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoomInCard({ service }: { service: (typeof services)[0] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    } else {
      controls.start({
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3 },
      });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={controls}
      className='bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition'
    >
      <div className='relative h-52'>
        <Image
          src={service.image}
          alt={service.title}
          fill
          className='object-cover'
        />
      </div>
      <div className='p-5'>
        <h3 className='text-xl font-semibold mb-2'>{service.title}</h3>
        <p className='text-sm text-gray-600 mb-3'>{service.description}</p>
        <span className='font-medium text-yellow-500'>{service.price}</span>
      </div>
    </motion.div>
  );
}
