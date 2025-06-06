"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";

type Review = {
  customerName: string;
  rating: number; // Đánh giá sao
  content: string;
  date: string;
  avatar?: string; // Hình ảnh khách hàng (tuỳ chọn)
};

const reviews: Review[] = [
  {
    customerName: "Nguyễn Văn A",
    rating: 5,
    content:
      "Dịch vụ rất tốt, nhân viên nhiệt tình và chuyên nghiệp, xe của tôi chạy mượt mà sau khi bảo dưỡng.",
    date: "15/04/2025",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    customerName: "Trần Thị B",
    rating: 4,
    content:
      "Giá cả hợp lý, tuy nhiên thời gian chờ hơi lâu một chút. Dịch vụ bảo dưỡng khá ổn.",
    date: "12/04/2025",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    customerName: "Lê Minh C",
    rating: 5,
    content:
      "Rất hài lòng với dịch vụ thay nhớt và kiểm tra phanh. Mình sẽ quay lại lần sau.",
    date: "10/04/2025",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
  },
];

export default function CustomerReviews() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollDirection(currentY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container '>
        <h2 className='text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10'>
          Đánh giá từ khách hàng
        </h2>

        <div className='space-y-8'>
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              review={review}
              index={index}
              scrollDirection={scrollDirection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  index,
  scrollDirection,
}: {
  review: Review;
  index: number;
  scrollDirection: "down" | "up";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "0px 0px -100px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: index * 0.15,
          ease: "easeOut",
        },
      });
    } else {
      controls.start({
        opacity: 0,
        y: scrollDirection === "down" ? -30 : 30,
        scale: 0.95,
      });
    }
  }, [inView, controls, scrollDirection, index]);

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: scrollDirection === "down" ? -30 : 30,
        scale: 0.95,
      }}
      animate={controls}
      className='bg-white rounded-xl shadow-md overflow-hidden p-6'
    >
      <div className='flex items-center space-x-4'>
        {review.avatar && (
          <div className='relative w-12 h-12'>
            <Image
              src={review.avatar}
              alt={review.customerName}
              fill
              className='rounded-full object-cover'
              sizes='48px'
            />
          </div>
        )}
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>
            {review.customerName}
          </h3>
          <div className='flex items-center text-yellow-400'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < review.rating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className='text-sm text-gray-500'>{review.date}</p>
        </div>
      </div>
      <p className='mt-4 text-gray-600'>{review.content}</p>
    </motion.div>
  );
}
