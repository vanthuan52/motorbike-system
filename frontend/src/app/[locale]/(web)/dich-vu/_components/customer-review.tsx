"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useAnimation, motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

type Review = {
  customerKey: string;
  rating: number;
  contentKey: string;
  dateKey: string;
  avatar?: string;
};

const reviews: Review[] = [
  {
    customerKey: "nguyen",
    rating: 5,
    contentKey: "nguyenContent",
    dateKey: "nguyenDate",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    customerKey: "tran",
    rating: 4,
    contentKey: "tranContent",
    dateKey: "tranDate",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    customerKey: "le",
    rating: 5,
    contentKey: "leContent",
    dateKey: "leDate",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
  },
];

export default function CustomerReviews() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const lastScrollY = useRef(0);
  const t = useTranslations(
    `${TRANSLATION_FILES.SERVICE_PAGE}.serviceReviewSection`
  );

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
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
          {t("title")}
        </h2>

        <div className="space-y-8">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              review={review}
              index={index}
              scrollDirection={scrollDirection}
              t={t}
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
  t,
}: {
  review: Review;
  index: number;
  scrollDirection: "down" | "up";
  t: ReturnType<typeof useTranslations>;
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
      className="bg-white rounded-xl shadow-md overflow-hidden p-6"
    >
      <div className="flex items-center space-x-4">
        {review.avatar && (
          <div className="relative w-12 h-12">
            <Image
              src={review.avatar}
              alt={t(review.customerKey)}
              fill
              className="rounded-full object-cover"
              sizes="48px"
            />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t(review.customerKey)}
          </h3>
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < review.rating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{`${t(review.dateKey)}`}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-600">{`${t(review.contentKey)}`}</p>
    </motion.div>
  );
}
