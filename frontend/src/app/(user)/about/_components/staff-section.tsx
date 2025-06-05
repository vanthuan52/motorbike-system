"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const staff = [
  {
    name: "Nguyễn Văn A",
    role: "Trưởng kỹ thuật",
    experience: "10 năm kinh nghiệm",
    quote: "Tôi luôn đặt sự an toàn và hài lòng của khách hàng lên hàng đầu.",
    image: "https://randomuser.me/api/portraits/men/37.jpg",
  },
  {
    name: "Trần Thị B",
    role: "Kỹ thuật viên máy móc",
    experience: "6 năm kinh nghiệm",
    quote: "Làm việc với cái tâm thì xe mới khỏe, khách mới vui.",
    image: "https://randomuser.me/api/portraits/women/36.jpg",
  },
  {
    name: "Lê Văn C",
    role: "Chuyên gia động cơ",
    experience: "8 năm kinh nghiệm",
    quote: "Mỗi chiếc xe là một thử thách – và tôi yêu điều đó!",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
  },
];

const StaffSection = () => {
  return (
    <section className='bg-gray-100 py-20 md:py-28'>
      <div className='container'>
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Đội Ngũ Nhân Viên
        </motion.h2>

        <motion.p
          className='text-center max-w-2xl mx-auto text-gray-600 mb-16 text-lg'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          Trung tâm XYZ tự hào sở hữu đội ngũ kỹ thuật viên lành nghề, giàu kinh
          nghiệm và luôn tận tâm với nghề. Từng thành viên đều sở hữu chứng chỉ
          chuyên môn và trải qua quá trình đào tạo bài bản.
        </motion.p>

        <div className='grid gap-10 md:grid-cols-3'>
          {staff.map((member, index) => (
            <motion.div
              key={index}
              className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * index,
                ease: "easeOut",
              }}
            >
              <div className='relative w-32 h-32 mx-auto mb-4'>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className='rounded-full object-cover border-4 border-indigo-500'
                  sizes='128px'
                  priority={index === 0}
                />
              </div>
              <motion.h3
                className='text-xl font-semibold text-gray-800'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                {member.name}
              </motion.h3>
              <motion.p
                className='text-indigo-600 font-medium'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.18 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                {member.role}
              </motion.p>
              <motion.p
                className='text-gray-500 text-sm mb-4'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.21 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                {member.experience}
              </motion.p>
              <motion.blockquote
                className='italic text-gray-700 border-l-4 border-indigo-400 pl-4 text-sm'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.24 + 0.1 * index,
                  ease: "easeOut",
                }}
              >
                “{member.quote}”
              </motion.blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
