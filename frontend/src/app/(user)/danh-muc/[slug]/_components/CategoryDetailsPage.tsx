"use client";

import { useParams } from "next/navigation";

import { motion } from "framer-motion";
import clsx from "clsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { mockCategories } from "../../mocks/Categories";

export default function CategoryDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const category = mockCategories.find((cat) => cat.slug === slug);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-2xl font-bold text-red-500 mb-4">
          Không tìm thấy danh mục
        </div>
        <CustomLink
          className="flex items-center gap-2 px-4 py-2 rounded-[30px] bg-orange-400 !! hover:bg-orange-500 transition cursor-pointer"
          href="/danh-muc"
        >
          <FaChevronLeft /> Quay lại
        </CustomLink>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center"
        )}
      >
        <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center items-center">
          <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 220px, 260px"
              className="object-contain rounded-xl"
              priority
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-orange-600">
            {category.name}
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-6 whitespace-pre-line">
            {category.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <CustomLink
              className={clsx(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold",
                "bg-orange-400 !text-white shadow hover:bg-orange-500 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-orange-300"
              )}
              href="/danh-muc"
            >
              <FaChevronLeft className="text-base" />
              Quay lại danh sách
            </CustomLink>
            <CustomLink
              href={`/san-pham?danh-muc=${slug}`}
              className={clsx(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold",
                "bg-white !text-orange-600 border border-orange-400 shadow hover:bg-orange-50 hover:border-orange-500 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-orange-200"
              )}
            >
              Xem sản phẩm
              <FaChevronRight className="text-base" />
            </CustomLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
