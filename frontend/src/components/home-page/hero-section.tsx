"use client";
import { motion } from "framer-motion";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { ROUTER_PATH } from "@/constant/router-path";

export default function HeroSection() {
  return (
    <section className='relative bg-white overflow-hidden'>
      <div className='container py-10 flex flex-col md:flex-row items-center gap-10'>
        <motion.div
          className='w-full text-center md:text-left'
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6'>
            Chăm sóc toàn diện <br className='hidden md:block' /> cho chiếc xe
            của bạn
          </h1>
          <p className='text-gray-600 text-lg md:text-xl mb-8'>
            Bảo dưỡng – sửa chữa – thay thế phụ tùng chính hãng. Đặt lịch nhanh
            chóng, phục vụ chuyên nghiệp.
          </p>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-4'>
            <CustomLink href={ROUTER_PATH.MAINTAIN_REGISTRATION}>
              <motion.button
                className='bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md transition cursor-pointer'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Đặt lịch ngay
              </motion.button>
            </CustomLink>
            <CustomLink href={ROUTER_PATH.SERVICES}>
              <motion.button
                className='border border-gray-800 text-gray-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition cursor-pointer'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xem dịch vụ
              </motion.button>
            </CustomLink>
          </div>
        </motion.div>

        <motion.div
          className='w-full text-center md:text-left'
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <motion.img
            src='/images/home-page/hero-banner-bike.jpg'
            alt='Hero image'
            className='w-full h-full mx-auto md:mx-0 rounded-md'
            whileHover={{ scale: 1.02 }}
          />
        </motion.div>
      </div>
      {/* Gradient background */}
      <div className='absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-100 to-transparent -z-10' />
    </section>
  );
}
