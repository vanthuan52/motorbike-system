"use client";
import React from "react";
import { ShieldCheck, Wrench, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <ShieldCheck className='w-10 h-10 text-blue-600' />,
    title: "Chất lượng uy tín",
    description:
      "Chúng tôi cam kết mang đến dịch vụ sửa chữa và bảo dưỡng chất lượng cao với linh kiện chính hãng.",
  },
  {
    icon: <Wrench className='w-10 h-10 text-green-600' />,
    title: "Đội ngũ tay nghề cao",
    description:
      "Kỹ thuật viên được đào tạo bài bản, giàu kinh nghiệm, tận tâm với từng phương tiện.",
  },
  {
    icon: <Clock className='w-10 h-10 text-yellow-500' />,
    title: "Nhanh chóng & đúng hẹn",
    description:
      "Tiếp nhận - xử lý - trả xe đúng lịch hẹn, tiết kiệm thời gian cho khách hàng.",
  },
  {
    icon: <Users className='w-10 h-10 text-purple-600' />,
    title: "Phục vụ tận tâm",
    description:
      "Tư vấn nhiệt tình, sẵn sàng hỗ trợ mọi lúc để mang lại trải nghiệm hài lòng nhất.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className='bg-gray-50 py-20'>
      <div className='container mx-auto px-4'>
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Vì sao chọn chúng tôi?
        </motion.h2>
        <motion.p
          className='text-center text-gray-600 mb-12 max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          Chúng tôi luôn đặt sự hài lòng và an toàn của khách hàng lên hàng đầu.
          Dưới đây là những lý do khách hàng luôn tin tưởng chúng tôi:
        </motion.p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className='bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-300'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              viewport={{ amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className='flex justify-center mb-4'>{feature.icon}</div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                {feature.title}
              </h3>
              <p className='text-sm text-gray-600'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
