"use client";
import { JSX } from "react";
import { Percent, Wrench } from "lucide-react";
import { motion } from "framer-motion";

interface Combo {
  title: string;
  description: string;
  price: string;
  icon: JSX.Element;
  highlight?: boolean;
}

const combos: Combo[] = [
  {
    title: "Gói bảo dưỡng toàn diện",
    description:
      "Kiểm tra toàn bộ xe, thay dầu, vệ sinh lọc gió, tăng xích, siết bu lông.",
    price: "Chỉ 299K",
    icon: <Wrench className='w-8 h-8 text-blue-600' />,
    highlight: true,
  },
  {
    title: "Combo thay nhớt + kiểm tra",
    description: "Thay dầu chính hãng và kiểm tra 10 hạng mục cơ bản.",
    price: "Chỉ 99K",
    icon: <Wrench className='w-8 h-8 text-green-600' />,
  },
  {
    title: "Ưu đãi khách hàng mới",
    description: "Giảm giá 20% cho lần bảo dưỡng đầu tiên.",
    price: "Giảm ngay -20%",
    icon: <Percent className='w-8 h-8 text-red-500' />,
  },
];

export default function ServiceComboSection() {
  return (
    <section className='bg-gray-50 py-20'>
      <div className='container mx-auto px-4'>
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ ease: "easeOut" }}
        >
          Gói dịch vụ ưu đãi / Combo hấp dẫn
        </motion.h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {combos.map((combo, idx) => (
            <motion.div
              key={idx}
              className={`group p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl bg-white`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
              viewport={{ amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: 0.12 * idx,
                ease: "easeOut",
              }}
            >
              <div className='flex items-center gap-4 mb-4'>
                <div>{combo.icon}</div>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {combo.title}
                </h3>
              </div>
              <p className='text-gray-600 text-sm mb-4'>{combo.description}</p>
              <div className='text-blue-600 text-lg font-bold'>
                {combo.price}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
