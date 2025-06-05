"use client";

import Image from "next/image";
import React from "react";
import { FaFlagCheckered, FaTools, FaUsers, FaAward } from "react-icons/fa";
import { motion } from "framer-motion";

const HistorySection = () => {
  return (
    <section className='bg-white py-20 md:py-28'>
      <div className='container'>
        <motion.h2
          className='text-3xl font-bold text-center text-gray-900 mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Lịch Sử Hình Thành
        </motion.h2>

        <div className='grid md:grid-cols-2 gap-10 items-center mb-16'>
          <motion.div
            className='relative w-full h-72'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src='/images/about/founding-story.jpg'
              alt='Câu chuyện thành lập'
              className='rounded-xl shadow-lg object-cover'
              fill
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
              Câu Chuyện Thành Lập
            </h3>
            <p className='text-lg text-gray-600 leading-relaxed'>
              Trung Tâm Bảo Dưỡng XYZ được thành lập vào năm 2013 bởi một nhóm
              kỹ sư yêu nghề và đam mê xe máy. Khởi đầu từ một gara nhỏ với chỉ
              2 nhân sự, trung tâm đã trải qua nhiều khó khăn, từ thiếu thốn
              thiết bị đến việc xây dựng lòng tin khách hàng. Nhưng bằng sự tận
              tâm và khát vọng nâng tầm dịch vụ, chúng tôi từng bước vươn lên,
              trở thành một trong những trung tâm bảo dưỡng uy tín tại khu vực.
            </p>
          </motion.div>
        </div>

        <motion.div
          className='bg-gray-50 p-8 rounded-xl shadow-inner'
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h3 className='text-2xl font-semibold text-gray-800 mb-8 text-center'>
            Chặng Đường Phát Triển
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
            {[FaFlagCheckered, FaTools, FaUsers, FaAward].map((Icon, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * idx,
                  ease: "easeOut",
                }}
              >
                <div className='text-indigo-600 text-4xl mb-4 flex justify-center'>
                  <Icon />
                </div>
                <h4 className='text-xl font-bold text-gray-800'>
                  {["2013", "2016", "2019", "2024"][idx]}
                </h4>
                <p className='text-gray-600 mt-2'>
                  {
                    [
                      "Thành lập trung tâm với quy mô nhỏ tại quận Bình Thạnh.",
                      "Mở rộng thêm 2 chi nhánh và đầu tư trang thiết bị hiện đại.",
                      "Đội ngũ kỹ thuật viên đạt 30 người, phục vụ hơn 10,000 khách hàng mỗi năm.",
                      "Đạt chứng nhận dịch vụ xuất sắc và mở rộng lên 5 chi nhánh toàn thành phố.",
                    ][idx]
                  }
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HistorySection;
