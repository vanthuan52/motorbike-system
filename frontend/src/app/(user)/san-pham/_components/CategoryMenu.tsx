"use client";

import { VehiclePart } from "@/types/VehiclePart";
import { Image } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

interface Props {
  categories: VehiclePart[];
  onCategoryClick?: (categoryId: string) => void;
  selectedCategories?: string[];
}

export default function CategoryMenu({
  categories,
  onCategoryClick,
  selectedCategories = [],
}: Props) {
  return (
    <section>
      <ol className="flex items-center whitespace-nowrap py-4">
        <li className="inline-flex items-center">
          <CustomLink
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600"
            href="/"
          >
            Trang chủ
          </CustomLink>
          <svg
            className="shrink-0 mx-2 size-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </li>
        <li
          className="inline-flex items-center text-sm font-semibold text-gray-800 truncate"
          aria-current="page"
        >
          Sản phẩm
        </li>
      </ol>
      <h3 className="uppercase text-4xl font-semibold py-4">Sản phẩm</h3>
      <Swiper spaceBetween={16} slidesPerView={"auto"} className="cursor-grab">
        {categories.map((cat) => (
          <SwiperSlide key={cat.id} style={{ width: "150px" }}>
            <div
              className={`group cursor-pointer flex flex-col items-center`}
              onClick={() => onCategoryClick?.(cat.id)}
            >
              <div className="w-full aspect-square rounded-[30px] overflow-hidden bg-gray-100 group-hover:opacity-80">
                <Image
                  src={cat.images && cat.images.length > 0 ? cat.images[0] : ""}
                  alt={cat.name}
                  className="!w-full !h-full object-cover"
                  preview={false}
                />
              </div>
              <p
                className={`mt-2 text-center text-sm font-medium text-gray-700 ${selectedCategories.includes(cat.id) ? "font-semibold" : ""}`}
              >
                {cat.name}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
