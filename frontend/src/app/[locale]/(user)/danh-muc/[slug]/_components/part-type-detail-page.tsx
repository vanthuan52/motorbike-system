"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { partTypeActions } from "@/features/part-type/store/part-type-slice";
import { PartTypeDetailsSkeleton } from "./part-type-detail-skeleton";
import { ROUTER_PATH } from "@/constant/router-path";
import { getValidImageSrc } from "@/utils/getValidImageSrc";

export default function PartTypeDetailsPage() {
  const t = useTranslations("partTypePage.partTypeDetail");
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const { partType, loadingSingle: loading } = useSelector(
    (state: RootState) => state.partType
  );

  useEffect(() => {
    dispatch(partTypeActions.getPartTypeDetail({ slug }));
  }, [dispatch, slug]);

  if (!partType) {
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
    return <PartTypeDetailsSkeleton />;
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
              src={getValidImageSrc(partType.photo)}
              alt={partType.name}
              fill
              sizes="(max-width: 768px) 220px, 260px"
              className="object-contain rounded-md"
              priority
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-orange-600">
            {partType.name}
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-6 whitespace-pre-line leading-relaxed">
            {partType.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-black font-normal">
            <CustomLink
              href={ROUTER_PATH.PART_TYPE}
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
