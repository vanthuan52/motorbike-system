"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useAnimation, motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

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
  const t = useTranslations(
    `${TRANSLATION_FILES.SERVICE_PAGE}.serviceReviewSection`,
  );

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("title")} className="mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} index={index} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  index,
  t,
}: {
  review: Review;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full relative"
    >
      <div className="text-primary-100 absolute top-6 right-8 opacity-40">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.017 21L16.41 14.59C16.598 14.072 16.716 13.518 16.716 12.927C16.716 10.218 14.526 8.02802 11.817 8.02802C11.517 8.02802 11.233 8.07002 10.96 8.14002L12.017 2.01703H8.01703L6.01703 12.017C5.90803 12.443 5.81703 12.879 5.81703 13.332C5.81703 16.536 8.41103 19.13 11.615 19.13C12.49 19.13 13.313 18.91 14.017 21ZM22.017 21L24.41 14.59C24.598 14.072 24.716 13.518 24.716 12.927C24.716 10.218 22.526 8.02802 19.817 8.02802C19.517 8.02802 19.233 8.07002 18.96 8.14002L20.017 2.01703H16.017L14.017 12.017C13.908 12.443 13.817 12.879 13.817 13.332C13.817 16.536 16.411 19.13 19.615 19.13C20.49 19.13 21.313 18.91 22.017 21Z" />
        </svg>
      </div>

      <div className="flex gap-1 mb-6 relative z-10">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="mt-2 text-gray-600 leading-relaxed flex-1 italic relative z-10 mb-8">{`"${t(review.contentKey)}"`}</p>

      <div className="flex items-center gap-4 mt-auto relative z-10">
        {review.avatar && (
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src={review.avatar}
              alt={t(review.customerKey)}
              fill
              className="rounded-full object-cover ring-2 ring-primary-50"
              sizes="48px"
            />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 leading-tight">
            {t(review.customerKey)}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{`${t(review.dateKey)}`}</p>
        </div>
      </div>
    </motion.div>
  );
}
