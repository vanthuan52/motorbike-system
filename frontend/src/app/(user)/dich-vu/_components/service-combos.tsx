"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export default function ServiceCombos() {
  const combos = [
    {
      title: "Combo 99K",
      services: ["Thay nhớt", "Kiểm tra tổng quát 15 điểm"],
      price: "99.000đ",
      note: "Tiết kiệm 50%",
    },
    {
      title: "Gói bảo dưỡng toàn diện",
      services: [
        "Thay nhớt",
        "Vệ sinh lọc gió",
        "Kiểm tra bugi",
        "Siết ốc tổng thể",
      ],
      price: "299.000đ",
      note: "Khuyên dùng định kỳ 3 tháng",
    },
    {
      title: "Ưu đãi khách hàng mới",
      services: ["Giảm 20% cho lần bảo dưỡng đầu tiên"],
      price: "Giảm giá",
      note: "Áp dụng trong tháng này",
    },
  ];

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container'>
        <h2 className='text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800'>
          Gói dịch vụ ưu đãi
        </h2>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {combos.map((combo, index) => (
            <SlideInCard key={index} combo={combo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Combo = {
  title: string;
  services: string[];
  price: string;
  note: string;
};

function SlideInCard({ combo, index }: { combo: Combo; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 0.6,
          delay: index * 0.2,
          ease: "easeOut",
        },
      });
    } else {
      controls.start({
        opacity: 0,
        y: 30,
        x: index % 2 === 0 ? -20 : 20,
      });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, x: index % 2 === 0 ? -20 : 20 }}
      animate={controls}
      className='bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition border-t-4 border-yellow-400'
    >
      <h3 className='text-xl font-semibold text-gray-900 mb-3'>
        {combo.title}
      </h3>

      <ul className='text-sm text-gray-600 mb-4 list-disc list-inside space-y-1'>
        {combo.services.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <div className='text-lg font-bold text-yellow-600 mb-1'>
        {combo.price}
      </div>
      <div className='text-sm text-gray-500 italic'>{combo.note}</div>
    </motion.div>
  );
}
