"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import Image from "next/image";
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
          href="/danh-muc"
          className="text-orange-500 hover:underline text-sm"
        >
          Quay lại danh mục
        </CustomLink>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start"
      >
        {/* Image section */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 220px, 260px"
              className="object-contain rounded-md"
              priority
            />
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-orange-600">
            {category.name}
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-6 whitespace-pre-line leading-relaxed">
            {category.description}
          </p>

          {/* Refactored link section */}
          <div className="flex items-center gap-2 text-sm text-black font-normal">
            <CustomLink
              href="/danh-muc"
              className="hover:!underline transition"
            >
              Quay lại danh sách
            </CustomLink>
            <span>|</span>
            <CustomLink
              href={`/san-pham?danh-muc=${slug}`}
              className="hover:!underline transition"
            >
              Xem sản phẩm
            </CustomLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
