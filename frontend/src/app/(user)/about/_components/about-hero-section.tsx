"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const AboutUsSection = () => {
  return (
    <section className='bg-gray-50 py-2 md:py-4'>
      <div className='container text-center'>
        <div className='mb-16'>
          <motion.div
            className='relative mb-8 w-full max-w-8xl mx-auto aspect-[3/1]'
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src='/images/about/about-hero.jpg'
              alt='Trung Tâm Bảo Dưỡng'
              className='object-cover rounded-xl shadow-lg'
              fill
              priority
            />
          </motion.div>
          <motion.h2
            className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Giới Thiệu Trung Tâm
          </motion.h2>
          <motion.p
            className='text-lg text-gray-700 leading-relaxed'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            Với hơn <strong>10 năm kinh nghiệm</strong> trong ngành bảo trì và
            sửa chữa xe máy, Trung Tâm Bảo Dưỡng XYZ cam kết mang lại dịch vụ
            chất lượng và sự hài lòng tối đa cho khách hàng. Chúng tôi luôn nỗ
            lực không ngừng để cải thiện chất lượng dịch vụ và đáp ứng nhu cầu
            ngày càng cao của quý khách hàng.
          </motion.p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          <motion.div
            className='bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
              Sứ Mệnh
            </h3>
            <p className='text-gray-600 text-lg'>
              Sứ mệnh của chúng tôi là cung cấp dịch vụ bảo dưỡng, sửa chữa xe
              máy với chất lượng cao, bảo đảm an toàn và sự hài lòng tuyệt đối
              cho khách hàng. Chúng tôi cam kết mang đến những giải pháp tối ưu
              và nhanh chóng, giúp chiếc xe của bạn luôn hoạt động ổn định.
            </p>
          </motion.div>

          <motion.div
            className='bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
              Tầm Nhìn
            </h3>
            <p className='text-gray-600 text-lg'>
              Tầm nhìn của Trung Tâm Bảo Dưỡng XYZ là trở thành địa chỉ tin cậy
              hàng đầu trong ngành bảo dưỡng và sửa chữa xe máy, không chỉ tại
              thành phố mà còn trên toàn quốc. Chúng tôi mong muốn nâng cao tiêu
              chuẩn dịch vụ, luôn sáng tạo và phát triển không ngừng để phục vụ
              khách hàng một cách tốt nhất.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
