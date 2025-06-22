"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { categoriesActions } from "@/features/category/store/category-slice";
import { CategoryDetailsSkeleton } from "./CategoryDetailsSkeleton";
import { ROUTER_PATH } from "@/constant/router-path";
import { getValidImageSrc } from "@/utils/getValidImageSrc";

export default function CategoryDetailsPage() {
  const t = useTranslations("categorypage.categoryDetail");
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const {
    detail: { data: categoryData, loading },
  } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(categoriesActions.fetchCategoryDetailRequest(slug));
  }, [dispatch, slug]);

  if (!categoryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-2xl font-bold text-red-500 mb-4">
          {t("notFound")}
        </div>
        <CustomLink
          href="/danh-muc"
          className="text-orange-500 hover:underline text-sm"
        >
          {t("backToList")}
        </CustomLink>
      </div>
    );
  }

  if (loading) {
    return <CategoryDetailsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start"
      >
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
            <Image
              src={getValidImageSrc(categoryData.photo)}
              alt={categoryData.name}
              fill
              sizes="(max-width: 768px) 220px, 260px"
              className="object-contain rounded-md"
              priority
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-orange-600">
            {categoryData.name}
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-6 whitespace-pre-line leading-relaxed">
            {categoryData.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-black font-normal">
            <CustomLink
              href={ROUTER_PATH.CATEGORY}
              className="hover:!underline transition"
            >
              {t("backToList")}
            </CustomLink>
            <span>|</span>
            <CustomLink
              href={`${ROUTER_PATH.PRODUCT}?danh-muc=${slug}`}
              className="hover:!underline transition"
            >
              {t("viewProducts")}
            </CustomLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
