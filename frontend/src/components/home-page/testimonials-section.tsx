"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface Testimonial {
  name: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Nguyễn Văn A",
    content:
      "Dịch vụ rất tốt, nhân viên nhiệt tình và chuyên nghiệp. Xe của tôi chạy êm hơn hẳn sau khi bảo dưỡng!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Trần Thị B",
    content:
      "Mình rất hài lòng với combo bảo dưỡng toàn diện, giá hợp lý và thời gian nhanh chóng.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Lê Văn C",
    content:
      "Trung tâm làm việc rất minh bạch, báo giá rõ ràng. Mình sẽ quay lại thường xuyên!",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Phạm Thùy D",
    content:
      "Ưu đãi lần đầu thật hấp dẫn! Mình được giảm giá và tư vấn tận tình.",
    avatar: "https://randomuser.me/api/portraits/women/51.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className='bg-white py-20'>
      <div className='container mx-auto px-4'>
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Khách hàng nói gì về chúng tôi?
        </motion.h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              className='bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className='flex flex-col items-center mb-4'>
                <div className='relative w-14 h-14 mb-2'>
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    className='rounded-full object-cover'
                    fill
                    sizes='56px'
                  />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>
                  {t.name}
                </h3>
              </div>
              <motion.p
                className='text-gray-600 text-sm '
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.18 + 0.1 * idx,
                  ease: "easeOut",
                }}
              >
                {t.content}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
