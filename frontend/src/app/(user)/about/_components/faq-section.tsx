"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqData = [
  {
    question: "Bao lâu nên bảo dưỡng xe máy?",
    answer:
      "Thông thường, bạn nên bảo dưỡng xe máy sau mỗi 1.000 – 1.500 km hoặc định kỳ mỗi 2 – 3 tháng để đảm bảo xe vận hành tốt và an toàn.",
  },
  {
    question: "Trung tâm có bảo hành sau sửa chữa không?",
    answer:
      "Có, tất cả các dịch vụ tại trung tâm đều được bảo hành theo chính sách rõ ràng, tùy thuộc vào từng hạng mục sửa chữa.",
  },
  {
    question: "Tôi có cần đặt lịch trước không?",
    answer:
      "Bạn có thể đến trực tiếp, nhưng đặt lịch trước giúp tiết kiệm thời gian và trung tâm phục vụ bạn nhanh chóng hơn.",
  },
  {
    question: "Trung tâm sử dụng phụ tùng loại nào?",
    answer:
      "Chúng tôi cam kết sử dụng 100% phụ tùng chính hãng hoặc từ các nhà sản xuất được ủy quyền.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className='bg-white py-20 md:py-28'>
      <div className='container'>
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Câu Hỏi Thường Gặp
        </motion.h2>

        <div className='space-y-6'>
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className='border border-gray-200 rounded-xl shadow-sm'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * index,
                ease: "easeOut",
              }}
            >
              <button
                onClick={() => toggle(index)}
                className='flex justify-between items-center w-full px-6 py-4 text-left text-gray-800 font-medium focus:outline-none'
              >
                {faq.question}
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  className='px-6 pb-4 text-gray-600 text-sm'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
